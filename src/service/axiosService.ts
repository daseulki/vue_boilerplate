import { DefaultResponse, TableResponse } from '@/types/commonInterface';
import service from './axiosInstance';
import { AxiosResponse } from 'axios'

type ErrorHandler = (error: any) => void;

/**
 * 요청 처리 유틸리티
 */

const handleRequest = async<T>(
  request: Promise<T>,
  errorHandler?: ErrorHandler
): Promise<T | null> => {
  try {
    return await request
  } catch(error) {
    errorHandler?.(error)
    return null
  }
}
const validateDefaultResponse = (data: any): data is DefaultResponse<any> => {
  return (
    typeof data === 'object' &&
    'code' in data &&
    'success' in data &&
    'message' in data &&
    ('data' in data || 'list' in data)
  );
};

const handleTableRequest = async<T> (
  request: Promise<AxiosResponse<DefaultResponse<TableResponse<T>>>>,
  errorHandler?: ErrorHandler
): Promise<DefaultResponse<TableResponse<T>> | null> => {
  try {
    const res = await request;
    if (validateDefaultResponse(res.data)) {
      return res.data;
    }
    console.error('Unexpected response structure:', res.data);
    return null;
  } catch (error) {
    errorHandler?.(error);
    return null;
  }
};


/**
 * 공통 파라미터 정리 유틸리티
 */
const cleanParams = (params?: Record<string, any>): Record<string, any> | undefined => {
  if (!params) return undefined;
  return Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
  );
};

/**
 * API 서비스
 */
export const apiService = {
  async get<T = any>(url: string, params?: any, errorHandler?: ErrorHandler): Promise<DefaultResponse<T> | null> {
    return handleRequest(service.get(url, { params: cleanParams(params) }), errorHandler);
  },
  async getTable<T = any>(url: string, params?: any, errorHandler?: ErrorHandler): Promise<DefaultResponse<TableResponse<T>> | null> {
    return handleTableRequest(service.get(url, { params: cleanParams(params) }), errorHandler);
  },  
   async save<T = any>(url: string, data?: any, errorHandler?: ErrorHandler): Promise<T | null> {
    const config = data instanceof FormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : undefined;

    return handleRequest(service.post(url, data, config), errorHandler);
  },
  async post<T = any>(url: string, data?: any, errorHandler?: ErrorHandler): Promise<DefaultResponse<T> | null> {
    return handleRequest(service.post(url, data), errorHandler);
  },

  async put<T = any>(url: string, data?: any, errorHandler?: ErrorHandler): Promise<T | null> {
    return handleRequest(service.put(url, data), errorHandler);
  },

  async delete<T = any>(url: string, params?: any, errorHandler?: ErrorHandler): Promise<T | null> {
    return handleRequest(service.delete(url, { params: cleanParams(params) }), errorHandler);
  },

  async patch<T = any>(url: string, data?: any, errorHandler?: ErrorHandler): Promise<T | null> {
    return handleRequest(service.patch(url, data), errorHandler);
  },

};
