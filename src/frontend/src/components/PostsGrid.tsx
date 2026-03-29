import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { ExternalBlob } from "../backend";
import type { Post } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useAddPost,
  useDeletePost,
  useEditPost,
  useGetCallerUserProfile,
} from "../hooks/useQueries";

export default function PostsGrid() {
  const { identity: _identity } = useInternetIdentity();
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const { mutate: addPost, isPending: isAdding } = useAddPost();
  const { mutate: editPost, isPending: isEditing } = useEditPost();
  const { mutate: deletePost } = useDeletePost();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletePostId, setDeletePostId] = useState<bigint | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const [newCaption, setNewCaption] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string | null>(null);

  const [editCaption, setEditCaption] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit: boolean,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isEdit) {
        setEditImage(file);
        setEditImagePreview(URL.createObjectURL(file));
      } else {
        setNewImage(file);
        setNewImagePreview(URL.createObjectURL(file));
      }
    }
  };

  const handleAddPost = async () => {
    if (!newImage || !newCaption.trim()) return;

    const arrayBuffer = await newImage.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const blob = ExternalBlob.fromBytes(uint8Array);

    addPost(
      { caption: newCaption.trim(), blob },
      {
        onSuccess: () => {
          setIsAddDialogOpen(false);
          setNewCaption("");
          setNewImage(null);
          setNewImagePreview(null);
        },
      },
    );
  };

  const handleEditPost = async () => {
    if (!editingPost || !editCaption.trim()) return;

    let blob: ExternalBlob;
    if (editImage) {
      const arrayBuffer = await editImage.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      blob = ExternalBlob.fromBytes(uint8Array);
    } else {
      blob = editingPost.blob;
    }

    editPost(
      { postId: editingPost.id, caption: editCaption.trim(), blob },
      {
        onSuccess: () => {
          setIsEditDialogOpen(false);
          setEditingPost(null);
          setEditCaption("");
          setEditImage(null);
          setEditImagePreview(null);
        },
      },
    );
  };

  const openEditDialog = (post: Post) => {
    setEditingPost(post);
    setEditCaption(post.caption);
    setEditImagePreview(post.blob.getDirectURL());
    setIsEditDialogOpen(true);
  };

  const handleDeletePost = () => {
    if (deletePostId !== null) {
      deletePost(deletePostId);
      setDeletePostId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const posts = profile?.posts || [];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Posts</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Post
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-image">Image *</Label>
                <Input
                  id="new-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, false)}
                />
                {newImagePreview && (
                  <img
                    src={newImagePreview}
                    alt="Preview"
                    className="mt-2 h-48 w-full rounded-lg object-cover"
                  />
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-caption">Caption *</Label>
                <Textarea
                  id="new-caption"
                  value={newCaption}
                  onChange={(e) => setNewCaption(e.target.value)}
                  placeholder="Write a caption..."
                  rows={3}
                />
              </div>
              <Button
                onClick={handleAddPost}
                disabled={!newImage || !newCaption.trim() || isAdding}
                className="w-full"
              >
                {isAdding ? "Adding..." : "Add Post"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {posts.length === 0 ? (
        <Card className="py-12">
          <CardContent className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              No posts yet. Create your first post!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Card
              key={post.id.toString()}
              className="overflow-hidden group relative"
            >
              <div className="aspect-square relative">
                <img
                  src={post.blob.getDirectURL()}
                  alt={post.caption}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    size="icon"
                    variant="secondary"
                    onClick={() => openEditDialog(post)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => setDeletePostId(post.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardContent className="p-3">
                <p className="text-sm line-clamp-2">{post.caption}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-image">Image</Label>
              <Input
                id="edit-image"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e, true)}
              />
              {editImagePreview && (
                <img
                  src={editImagePreview}
                  alt="Preview"
                  className="mt-2 h-48 w-full rounded-lg object-cover"
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-caption">Caption *</Label>
              <Textarea
                id="edit-caption"
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                placeholder="Write a caption..."
                rows={3}
              />
            </div>
            <Button
              onClick={handleEditPost}
              disabled={!editCaption.trim() || isEditing}
              className="w-full"
            >
              {isEditing ? "Updating..." : "Update Post"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deletePostId !== null}
        onOpenChange={() => setDeletePostId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Post</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this post? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
