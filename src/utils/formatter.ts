import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import relativeTime from 'dayjs/plugin/relativeTime';

// 设置语言和插件
dayjs.locale('zh-cn');
dayjs.extend(relativeTime);

/**
 * 价格格式化
 */
export const price = {
  // 基础格式化
  format: (price: number | string, options?: { prefix?: string; decimals?: number }) => {
    const { prefix = '¥', decimals = 2 } = options || {};
    return `${prefix}${Number(price).toFixed(decimals)}`;
  },

  // 千分位格式化
  formatWithCommas: (price: number | string, options?: { prefix?: string; decimals?: number }) => {
    const formatted = price.format(price, options);
    const [integer, decimal] = formatted.split('.');
    return `${integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}.${decimal}`;
  },

  // 中文大写格式化
  formatToChinese: (price: number) => {
    const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const units = ['', '拾', '佰', '仟'];
    const bigUnits = ['', '万', '亿'];
    const decimalUnits = ['角', '分'];

    // 处理整数部分
    const intPart = Math.floor(price);
    const decimalPart = Math.round((price - intPart) * 100);

    let result = '';
    let unit = 0;

    while (intPart > 0) {
      const section = intPart % 10000;
      result = (section === 0 ? '' : section.toString().split('').map((n, i, arr) => 
        digits[Number(n)] + (Number(n) !== 0 ? units[arr.length - 1 - i] : '')
      ).join('') + bigUnits[unit]) + result;
      intPart = Math.floor(intPart / 10000);
      unit++;
    }

    result = result ? result + '元' : '';

    // 处理小数部分
    if (decimalPart > 0) {
      const decimal = decimalPart.toString().padStart(2, '0').split('');
      result += decimal.map((n, i) => Number(n) === 0 ? '' : digits[Number(n)] + decimalUnits[i]).join('');
    } else {
      result += '整';
    }

    return result || '零元整';
  }
};

/**
 * 日期格式化
 */
export const date = {
  // 基础格式化
  format: (date: Date | string | number, format = 'YYYY-MM-DD HH:mm:ss') => {
    return dayjs(date).format(format);
  },

  // 相对时间
  fromNow: (date: Date | string | number) => {
    return dayjs(date).fromNow();
  },

  // 友好时间格式
  friendly: (date: Date | string | number) => {
    const target = dayjs(date);
    const now = dayjs();
    const diff = now.diff(target, 'day');

    if (diff === 0) {
      return target.format('HH:mm');
    } else if (diff === 1) {
      return `昨天 ${target.format('HH:mm')}`;
    } else if (diff === 2) {
      return `前天 ${target.format('HH:mm')}`;
    } else if (diff < 7) {
      return target.format('dddd HH:mm');
    } else if (target.year() === now.year()) {
      return target.format('MM-DD HH:mm');
    } else {
      return target.format('YYYY-MM-DD HH:mm');
    }
  }
};

/**
 * 数字格式化
 */
export const number = {
  // 千分位格式化
  format: (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  // 文件大小格式化
  formatSize: (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  },

  // 数字缩写
  formatShort: (num: number) => {
    if (num < 1000) return num.toString();
    const units = ['', 'K', 'M', 'B', 'T'];
    const order = Math.floor(Math.log10(num) / 3);
    const unitName = units[order];
    const value = num / Math.pow(10, order * 3);
    return `${value.toFixed(1)}${unitName}`;
  }
};

/**
 * 字符串格式化
 */
export const string = {
  // 手机号格式化
  formatPhone: (phone: string) => {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  },

  // 银行卡格式化
  formatBankCard: (card: string) => {
    return card.replace(/\s/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
  },

  // 身份证格式化
  formatIdCard: (id: string) => {
    return id.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2');
  },

  // 名字脱敏
  formatName: (name: string) => {
    if (name.length <= 2) {
      return name.substr(0, 1) + '*';
    }
    const stars = '*'.repeat(name.length - 2);
    return name.substr(0, 1) + stars + name.substr(-1);
  },

  // 邮箱脱敏
  formatEmail: (email: string) => {
    const [name, domain] = email.split('@');
    const hiddenName = name.substr(0, 1) + '*'.repeat(name.length - 1);
    return `${hiddenName}@${domain}`;
  }
};

/**
 * 地址格式化
 */
export const address = {
  // 格式化为一行
  format: (province: string, city: string, district: string, detail: string) => {
    return [province, city, district, detail].filter(Boolean).join(' ');
  },

  // 格式化为数组
  parse: (address: string) => {
    return address.split(' ').filter(Boolean);
  }
};

export default {
  price,
  date,
  number,
  string,
  address
};

/**
 * 使用示例：
 * 
 * // 价格格式化
 * price.format(1234.56); // ¥1234.56
 * price.formatWithCommas(1234.56); // ¥1,234.56
 * price.formatToChinese(1234.56); // 壹仟贰佰叁拾肆元伍角陆分
 * 
 * // 日期格式化
 * date.format(new Date()); // 2024-04-01 12:34:56
 * date.fromNow('2024-03-31'); // 1 天前
 * date.friendly('2024-03-31 12:34:56'); // 昨天 12:34
 * 
 * // 数字格式化
 * number.format(1234567); // 1,234,567
 * number.formatSize(1234567); // 1.18 MB
 * number.formatShort(1234567); // 1.2M
 * 
 * // 字符串格式化
 * string.formatPhone('13812345678'); // 138****5678
 * string.formatBankCard('6225365271562822'); // 6225 3652 7156 2822
 * string.formatName('张三丰'); // 张*丰
 */