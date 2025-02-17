export type DefaultResponse<T = any> = 
  | ({ 
      code: string; 
      success: boolean;
      message: string; // 상태 메세지
      data: T; // 데이터가 존재하는 경우
    } & Partial<TableResponse<T>>) // TableResponse 속성은 포함되지만 비어 있음
  | ({ 
      code: string;
      success: boolean;
      message: string;
      data?: never; 
  } & TableResponse<T>) 
    

export class PageParams{
  pageNumber: number// 기본값을 0
  pageSize: number // 기본값 설정
  constructor() {
    this.pageNumber = 0
    this.pageSize = 10
  }
}

export class PageInfo extends PageParams{
  totalCount: number
  totalPages: number

  constructor() {
    super()
    this.totalCount = 0 
    this.totalPages = 0
  }
}
export class TableResponse<T = any>{
  list: T[] = []
  pageInfo?:PageInfo
  // [key] ?: string
  
  constructor() {
    this.list = []
    this.pageInfo = new PageInfo()
  }
}



import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string //탭에 보이는 화면명 
    order?: number // 내부 화면에 보여줄 이름 
  }
}