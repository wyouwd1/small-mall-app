import Taro from '@tarojs/taro';
import config from '../config/env';

// 验证规则类型
type ValidateRule = {
  required?: boolean;
  message?: string;
  min?: number;
  max?: number;
  pattern?: RegExp;
  validator?: (value: any) => boolean | Promise<boolean>;
};

// 验证规则集合类型
type ValidateRules = Record<string, ValidateRule | ValidateRule[]>;

// 验证错误类型
type ValidateError = {
  field: string;
  message: string;
};

/**
 * 表单验证函数
 * @param values 表单值
 * @param rules 验证规则
 * @returns 验证结果
 */
export const validateForm = async (
  values: Record<string, any>,
  rules: ValidateRules
): Promise<ValidateError[]> => {
  const errors: ValidateError[] = [];

  for (const field in rules) {
    const value = values[field];
    const fieldRules = Array.isArray(rules[field])
      ? rules[field] as ValidateRule[]
      : [rules[field] as ValidateRule];

    for (const rule of fieldRules) {
      try {
        // 必填验证
        if (rule.required && (value === undefined || value === null || value === '')) {
          throw new Error(rule.message || `${field} 不能为空`);
        }

        if (value !== undefined && value !== null && value !== '') {
          // 最小长度验证
          if (rule.min !== undefined && String(value).length < rule.min) {
            throw new Error(rule.message || `${field} 长度不能小于 ${rule.min}`);
          }

          // 最大长度验证
          if (rule.max !== undefined && String(value).length > rule.max) {
            throw new Error(rule.message || `${field} 长度不能大于 ${rule.max}`);
          }

          // 正则验证
          if (rule.pattern && !rule.pattern.test(String(value))) {
            throw new Error(rule.message || `${field} 格式不正确`);
          }

          // 自定义验证
          if (rule.validator) {
            const result = await Promise.resolve(rule.validator(value));
            if (!result) {
              throw new Error(rule.message || `${field} 验证失败`);
            }
          }
        }
      } catch (error) {
        errors.push({
          field,
          message: error.message
        });
        break; // 一个字段只显示第一个错误
      }
    }
  }

  return errors;
};

/**
 * 常用验证规则
 */
export const rules = {
  // 手机号验证
  phone: {
    required: true,
    pattern: config.business.regex.phone,
    message: '请输入正确的手机号'
  },

  // 邮箱验证
  email: {
    required: true,
    pattern: config.business.regex.email,
    message: '请输入正确的邮箱地址'
  },

  // 密码验证
  password: {
    required: true,
    pattern: config.business.regex.password,
    message: '密码必须包含大小写字母和数字，长度8-16位'
  },

  // 验证码验证
  code: {
    required: true,
    pattern: /^\d{6}$/,
    message: '请输入6位数字验证码'
  },

  // 必填验证
  required: (message?: string) => ({
    required: true,
    message: message || '此项不能为空'
  }),

  // 长度验证
  length: (min: number, max: number, message?: string) => ({
    min,
    max,
    message: message || `长度必须在${min}-${max}个字符之间`
  }),

  // 金额验证
  amount: {
    required: true,
    pattern: /^([1-9]\d*|0)(\.\d{1,2})?$/,
    message: '请输入正确的金额'
  }
};

/**
 * 显示表单错误
 * @param errors 错误信息
 */
export const showFormError = (errors: ValidateError[]) => {
  if (errors.length > 0) {
    Taro.showToast({
      title: errors[0].message,
      icon: 'none'
    });
    return false;
  }
  return true;
};

/**
 * 表单验证示例
 */
export const formExample = async () => {
  const form = {
    phone: '13800138000',
    email: 'example@example.com',
    password: 'Password123',
    code: '123456',
    amount: '99.99'
  };

  const validateRules = {
    phone: rules.phone,
    email: rules.email,
    password: rules.password,
    code: rules.code,
    amount: rules.amount,
    // 自定义验证示例
    custom: {
      required: true,
      validator: (value: string) => value === 'custom',
      message: '自定义验证失败'
    }
  };

  const errors = await validateForm(form, validateRules);
  return showFormError(errors);
};