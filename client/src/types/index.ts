export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    favoriteCategories?: string[];
    role: "USER" | "ADMIN";
    followersCount?: number;
    followingCount?: number;
    publishedPostsCount?: number;
    isFollowing?: boolean;
}

export interface Post {
    id: string;
    userId: string;
    authorName: string;
    authorAvatar?: string;
    bookId?: string;
    bookTitle?: string;
    bookCover?: string;
    bookAuthor?: string;
    title: string;
    content: string;
    favoriteIdea?: string;
    tags: string[];
    coverImage?: string;
    status: "draft" | "published";
    likesCount: number;
    commentsCount: number;
    savesCount: number;
    createdAt: string;
    updatedAt?: string;
    publishedAt?: string;
    isLiked?: boolean;
    isSaved?: boolean;
}

export interface Comment {
    id: string;
    postId: string;
    userId: string;
    authorName: string;
    authorAvatar?: string;
    text: string;
    createdAt: string;
}
