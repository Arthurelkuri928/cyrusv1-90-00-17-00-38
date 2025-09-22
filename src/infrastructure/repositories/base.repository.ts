
import { supabase } from '@/integrations/supabase/client';
import { ApiException, ApiResponse } from '@/shared/types/api';

export abstract class BaseRepository {
  protected client = supabase;

  protected handleError(error: any): never {
    console.error('Repository error:', error);
    
    if (error.message) {
      throw new ApiException(error.message, error.code, error.details);
    }
    
    throw new ApiException('An unexpected error occurred');
  }

  protected createResponse<T>(data: T, success: boolean = true): ApiResponse<T> {
    return {
      data,
      success,
    };
  }

  protected async executeQuery<T>(
    queryFn: () => Promise<{ data: T; error: any }>
  ): Promise<T> {
    try {
      const { data, error } = await queryFn();
      
      if (error) {
        this.handleError(error);
      }
      
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }
}
