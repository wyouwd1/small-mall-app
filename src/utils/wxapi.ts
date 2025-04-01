import Taro from '@tarojs/taro';

/**
 * 微信支付
 */
export const payment = {
  // 发起支付
  async pay(params: WechatMiniprogram.RequestPaymentOption): Promise<boolean> {
    try {
      await Taro.requestPayment(params);
      return true;
    } catch (error) {
      console.error('Payment failed:', error);
      return false;
    }
  },

  // 生成支付参数
  generatePayParams(orderInfo: {
    timeStamp: string;
    nonceStr: string;
    package: string;
    signType: 'MD5' | 'HMAC-SHA256' | 'RSA';
    paySign: string;
  }): WechatMiniprogram.RequestPaymentOption {
    return {
      ...orderInfo,
      success: () => {
        Taro.showToast({
          title: '支付成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.error('Payment error:', err);
        Taro.showToast({
          title: '支付失败',
          icon: 'none'
        });
      }
    };
  }
};

/**
 * 用户授权
 */
export const auth = {
  // 获取用户信息授权
  async getUserProfile(): Promise<WechatMiniprogram.GetUserProfileSuccessCallbackResult | null> {
    try {
      return await Taro.getUserProfile({
        desc: '用于完善会员资料'
      });
    } catch (error) {
      console.error('Get user profile failed:', error);
      return null;
    }
  },

  // 获取手机号码授权
  async getPhoneNumber(e: any): Promise<string | null> {
    try {
      if (e.detail.errMsg !== 'getPhoneNumber:ok') {
        throw new Error('User denied phone number authorization');
      }
      // TODO: 调用后端接口解密手机号
      return e.detail.code;
    } catch (error) {
      console.error('Get phone number failed:', error);
      return null;
    }
  },

  // 检查授权状态
  async checkAuthSetting(scope: keyof WechatMiniprogram.AuthSetting): Promise<boolean> {
    try {
      const { authSetting } = await Taro.getSetting();
      return !!authSetting[scope];
    } catch (error) {
      console.error('Check auth setting failed:', error);
      return false;
    }
  },

  // 打开授权设置页
  openSetting(): Promise<WechatMiniprogram.OpenSettingSuccessCallbackResult> {
    return Taro.openSetting();
  }
};

/**
 * 分享功能
 */
export const share = {
  // 生成分享参数
  generateShareParams(params: {
    title: string;
    path?: string;
    imageUrl?: string;
  }): WechatMiniprogram.Page.IShareAppMessageOption {
    return {
      title: params.title,
      path: params.path || '/pages/index/index',
      imageUrl: params.imageUrl,
      success: () => {
        Taro.showToast({
          title: '分享成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.error('Share failed:', err);
      }
    };
  },

  // 生成分享海报
  async generatePoster(params: {
    title: string;
    qrcode: string;
    avatar?: string;
    nickname?: string;
  }): Promise<string> {
    try {
      const ctx = Taro.createCanvasContext('shareCanvas');
      
      // 绘制背景
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 300, 400);

      // 绘制标题
      ctx.fillStyle = '#333333';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(params.title, 20, 40, 260);

      // 绘制二维码
      const qrcode = await Taro.getImageInfo({ src: params.qrcode });
      ctx.drawImage(qrcode.path, 100, 200, 100, 100);

      // 绘制用户信息
      if (params.avatar && params.nickname) {
        const avatar = await Taro.getImageInfo({ src: params.avatar });
        ctx.save();
        ctx.beginPath();
        ctx.arc(40, 340, 20, 0, 2 * Math.PI);
        ctx.clip();
        ctx.drawImage(avatar.path, 20, 320, 40, 40);
        ctx.restore();

        ctx.fillStyle = '#666666';
        ctx.font = '14px sans-serif';
        ctx.fillText(params.nickname, 70, 340);
      }

      // 绘制提示文本
      ctx.fillStyle = '#999999';
      ctx.font = '12px sans-serif';
      ctx.fillText('长按识别二维码', 110, 320);

      await new Promise(resolve => ctx.draw(false, resolve));

      // 导出图片
      const { tempFilePath } = await Taro.canvasToTempFilePath({
        canvasId: 'shareCanvas',
        fileType: 'jpg',
        quality: 1
      });

      return tempFilePath;
    } catch (error) {
      console.error('Generate poster failed:', error);
      throw error;
    }
  }
};

/**
 * 图片处理
 */
export const image = {
  // 选择图片
  async choose(options: Partial<Taro.chooseImage.Option> = {}): Promise<string[]> {
    try {
      const { tempFilePaths } = await Taro.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        ...options
      });
      return tempFilePaths;
    } catch (error) {
      console.error('Choose image failed:', error);
      return [];
    }
  },

  // 预览图片
  preview(urls: string[], current?: string): void {
    Taro.previewImage({
      urls,
      current
    });
  },

  // 保存图片到相册
  async save(filePath: string): Promise<boolean> {
    try {
      await Taro.saveImageToPhotosAlbum({
        filePath
      });
      return true;
    } catch (error) {
      console.error('Save image failed:', error);
      return false;
    }
  },

  // 压缩图片
  async compress(filePath: string): Promise<string> {
    try {
      const { tempFilePath } = await Taro.compressImage({
        src: filePath,
        quality: 80
      });
      return tempFilePath;
    } catch (error) {
      console.error('Compress image failed:', error);
      return filePath;
    }
  }
};

/**
 * 位置服务
 */
export const location = {
  // 获取当前位置
  async getCurrentLocation(): Promise<WechatMiniprogram.GetLocationSuccessCallbackResult | null> {
    try {
      return await Taro.getLocation({
        type: 'gcj02'
      });
    } catch (error) {
      console.error('Get location failed:', error);
      return null;
    }
  },

  // 打开位置选择
  async chooseLocation(): Promise<WechatMiniprogram.ChooseLocationSuccessCallbackResult | null> {
    try {
      return await Taro.chooseLocation();
    } catch (error) {
      console.error('Choose location failed:', error);
      return null;
    }
  },

  // 打开导航
  openLocation(params: WechatMiniprogram.OpenLocationOption): void {
    Taro.openLocation(params);
  }
};

export default {
  payment,
  auth,
  share,
  image,
  location
};

/**
 * 使用示例：
 * 
 * // 发起支付
 * const payParams = payment.generatePayParams({...});
 * await payment.pay(payParams);
 * 
 * // 获取用户信息
 * const userInfo = await auth.getUserProfile();
 * 
 * // 分享
 * const shareParams = share.generateShareParams({
 *   title: '分享标题',
 *   path: '/pages/index/index'
 * });
 * 
 * // 选择图片
 * const images = await image.choose({ count: 9 });
 * 
 * // 获取位置
 * const location = await location.getCurrentLocation();
 */