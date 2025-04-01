import dayjs from 'dayjs';
import { OrderStatus, PayType, CouponType } from '../services/types';

/**
 * 价格相关工具函数
 */
export const price = {
  // 格式化价格
  format: (price: number | string, options?: { prefix?: string; decimals?: number }) => {
    const { prefix = '¥', decimals = 2 } = options || {};
    return `${prefix}${Number(price).toFixed(decimals)}`;
  },

  // 计算折扣价
  discount: (price: number, discount: number) => {
    return Number((price * (discount / 10)).toFixed(2));
  },

  // 计算满减
  subtract: (price: number, subtract: number) => {
    return Number((price - subtract).toFixed(2));
  },

  // 计算总价
  total: (items: Array<{ price: number; quantity: number }>) => {
    return Number(items.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2));
  }
};

/**
 * 日期相关工具函数
 */
export const date = {
  // 格式化日期
  format: (date: Date | string | number, format = 'YYYY-MM-DD HH:mm:ss') => {
    return dayjs(date).format(format);
  },

  // 相对时间
  fromNow: (date: Date | string | number) => {
    return dayjs(date).fromNow();
  },

  // 是否过期
  isExpired: (date: Date | string | number) => {
    return dayjs(date).isBefore(dayjs());
  },

  // 剩余时间（秒）
  remaining: (date: Date | string | number) => {
    return Math.max(0, dayjs(date).diff(dayjs(), 'second'));
  },

  // 格式化剩余时间
  formatRemaining: (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const remainingSeconds = seconds % 60;

    if (days > 0) {
      return `${days}天${hours}小时`;
    }
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`;
    }
    if (minutes > 0) {
      return `${minutes}分钟${remainingSeconds}秒`;
    }
    return `${remainingSeconds}秒`;
  }
};

/**
 * 订单相关工具函数
 */
export const order = {
  // 订单状态文本
  statusText: (status: OrderStatus) => {
    const statusMap: Record<OrderStatus, string> = {
      [OrderStatus.PENDING_PAYMENT]: '待支付',
      [OrderStatus.PENDING_SHIPMENT]: '待发货',
      [OrderStatus.PENDING_RECEIPT]: '待收货',
      [OrderStatus.COMPLETED]: '已完成',
      [OrderStatus.CANCELLED]: '已取消',
      [OrderStatus.REFUNDING]: '退款中',
      [OrderStatus.REFUNDED]: '已退款'
    };
    return statusMap[status] || '未知状态';
  },

  // 支付方式文本
  payTypeText: (type: PayType) => {
    const typeMap: Record<PayType, string> = {
      [PayType.WECHAT]: '微信支付',
      [PayType.ALIPAY]: '支付宝'
    };
    return typeMap[type] || '未知方式';
  },

  // 订单可执行的操作
  actions: (status: OrderStatus): Array<{
    text: string;
    type: 'primary' | 'default' | 'danger';
    action: string;
  }> => {
    switch (status) {
      case OrderStatus.PENDING_PAYMENT:
        return [
          { text: '取消订单', type: 'default', action: 'cancel' },
          { text: '立即支付', type: 'primary', action: 'pay' }
        ];
      case OrderStatus.PENDING_SHIPMENT:
        return [
          { text: '申请退款', type: 'danger', action: 'refund' }
        ];
      case OrderStatus.PENDING_RECEIPT:
        return [
          { text: '查看物流', type: 'default', action: 'logistics' },
          { text: '确认收货', type: 'primary', action: 'confirm' }
        ];
      case OrderStatus.COMPLETED:
        return [
          { text: '评价', type: 'primary', action: 'review' },
          { text: '再次购买', type: 'default', action: 'rebuy' }
        ];
      default:
        return [];
    }
  }
};

/**
 * 优惠券相关工具函数
 */
export const coupon = {
  // 优惠券类型文本
  typeText: (type: CouponType) => {
    const typeMap: Record<CouponType, string> = {
      [CouponType.AMOUNT]: '满减券',
      [CouponType.DISCOUNT]: '折扣券'
    };
    return typeMap[type] || '未知类型';
  },

  // 优惠券描述
  description: (type: CouponType, value: number, minAmount?: number) => {
    if (type === CouponType.AMOUNT) {
      return minAmount ? `满${minAmount}减${value}` : `立减${value}`;
    }
    if (type === CouponType.DISCOUNT) {
      return minAmount ? `满${minAmount}打${value}折` : `${value}折`;
    }
    return '';
  },

  // 计算优惠金额
  calculate: (type: CouponType, value: number, amount: number) => {
    if (type === CouponType.AMOUNT) {
      return value;
    }
    if (type === CouponType.DISCOUNT) {
      return Number((amount * (1 - value / 10)).toFixed(2));
    }
    return 0;
  }
};

/**
 * 字符串相关工具函数
 */
export const string = {
  // 脱敏处理
  desensitize: (str: string, start: number, end: number) => {
    const chars = str.split('');
    const mask = '*'.repeat(end - start);
    return chars.slice(0, start).join('') + mask + chars.slice(end).join('');
  },

  // 手机号脱敏
  maskPhone: (phone: string) => {
    return string.desensitize(phone, 3, 7);
  },

  // 邮箱脱敏
  maskEmail: (email: string) => {
    const [name, domain] = email.split('@');
    return `${string.desensitize(name, 1, name.length)}@${domain}`;
  },

  // 姓名脱敏
  maskName: (name: string) => {
    return name.length > 2
      ? string.desensitize(name, 1, name.length - 1)
      : string.desensitize(name, 1, name.length);
  }
};

/**
 * 数字相关工具函数
 */
export const number = {
  // 数字千分位格式化
  format: (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  },

  // 数字转中文
  toChinese: (num: number) => {
    const units = ['', '万', '亿'];
    const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    let result = '';
    let unit = 0;

    while (num > 0) {
      const section = num % 10000;
      result = (section === 0 ? '' : section.toString().split('').map(n => digits[Number(n)]).join('') + units[unit]) + result;
      num = Math.floor(num / 10000);
      unit++;
    }

    return result || '零';
  },

  // 数字转大写金额
  toUpperCase: (num: number) => {
    const digits = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
    const units = ['', '拾', '佰', '仟'];
    const bigUnits = ['', '万', '亿'];
    const decimals = ['角', '分'];

    // 处理整数部分
    const intPart = Math.floor(num);
    const decPart = Math.round((num - intPart) * 100);

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
    if (decPart > 0) {
      const dec = decPart.toString().padStart(2, '0').split('');
      result += dec.map((n, i) => Number(n) === 0 ? '' : digits[Number(n)] + decimals[i]).join('');
    } else {
      result += '整';
    }

    return result || '零元整';
  }
};