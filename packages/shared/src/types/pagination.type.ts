export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface CursorParams {
  limit?: number;
  cursor?: string;
}

export interface SuccessResponse<T> {
  success: true;
  data: T;
}
