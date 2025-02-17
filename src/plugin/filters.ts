import dayjs from 'dayjs'
import 'dayjs/locale/ko'

dayjs.locale('ko')

const dateFormat = (date: string | null | undefined): string => {
  if (!date) {
    return ""
  } else {
    return dayjs(date).format('YYYY-MM-DD')
  }
}

const dateLongFormat = (date: string | null | undefined): string => {
  if (!date) {
    return ""
  } else {
    return dayjs(date).format('YYYY-MM-DD(ddd) HH:mm')
  }
}

const timeFormat = (date: string | null | undefined): string => {
  if (!date) {
    return ""
  } else {
    return dayjs(date).format('YYYY-MM-DD HH:mm')
  }
}


const vatContain  = (num: number | string | null | undefined): string => {
  if (!num) {
    return "0"
  } else {
    return (Number(num)*1.1).toLocaleString()
  }
}

const numberComma = (num: number | string | null | undefined): string => {
  if (!num) {
    return "0"
  } else {
    return Number(num).toLocaleString()
  }
}

const phone = (num: string | null | undefined): string => {
  if (!num) {
    return ""
  } else {
    return String(num).replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})$/, "$1-$2-$3").replace("--", "-")
  }
}

const bizNum = (num: string | null | undefined): string => {
  if (!num) {
    return ""
  } else {
    return String(num).replace(/(\d{3})(\d{2})(\d{5})/, "$1-$2-$3").replace("--", "-")
  }
}

const fileSize = (num: number): string => {
  if (num > 1024 * 1024 * 1024) {
    return (num / (1024 * 1024 * 1024)).toFixed(2) + " GB"
  } else if (num > 1024 * 1024) {
    return (num / (1024 * 1024)).toFixed(2) + " MB"
  } else if (num > 1024) {
    return (num / 1024).toFixed(2) + " KB"
  } else {
    return num + " bytes"
  }
}

const onlyFileName = (fileName: string): string => {
  if(!fileName) return ""
  const lastDotIndex = fileName.lastIndexOf('.')
  // '.'이 없으면 전체 문자열 반환
  if (lastDotIndex === -1) return fileName
  
  // '.' 이전의 문자열만 반환
  return fileName.slice(0, lastDotIndex)
}

const maskingData = (type: string, data: any): string => {
  switch (type) {
    case '주민등록번호':
      // 주민등록번호 뒤에 6자리 : 123456-1******
      if (/^\d{6}-\d{7}$/.test(data)) {
        return data.slice(0, 8) + '******'
      }
      break

    case '이름':
      if (typeof data === 'string') {
        const length = data.length
        if (length === 2) {
          // 2글자: 끝 김*
          return data[0] + '*'
        } else if (length === 3) {
          // 3글자: 가운데 김*한
          return data[0] + '*' + data[2]
        } else if (length >= 4) {
          // 4글자 이상 2,3 번째 김**쥐
          return data[0] + '**' + data.slice(3)
        }
      }
      break

    case '영문이름':
      if (typeof data === 'string') {
        const names = data.split(' ')
        if (names.length >= 2) {
          // 두번째 블록 글자 마스킹 john **** / john **** kim
          names[1] = '****'
          return names.join(' ')
        }
      }
      break

    case '연락처':
      // 연락처 뒷번호 4자리 010-5555-****
      if (/^\d{3}-\d{4}-\d{4}$/.test(data)) {
        return data.slice(0, -4) + '****'
      }
      break

    case '이메일':
      // 이메일: 아이디 앞4자리 ****asb@naver.com
      if (typeof data === 'string') {
        const [localPart, domain] = data.split('@')
        if (localPart.length > 4) {
          return '****' + localPart.slice(4) + '@' + domain
        }
      }
      break

    case 'ID':
      // ID 앞 네자리 ****abs
      if (typeof data === 'string' && data.length > 4) {
        return '****' + data.slice(4)
      }
      break

    default:
      return data
  }
  return data // Return the original data if it doesn't match any case
}
const birthFormat  = (date: string | null | undefined): string => {
  if (!date) {
    return ""
  } else {
    return dayjs(date).format('YYMMDD')
  }
}

export default {
  dateFormat, dateLongFormat, timeFormat, vatContain, numberComma, phone, fileSize, onlyFileName, maskingData, birthFormat, bizNum
}
