import type { RequestConfig } from 'umi';
import { history, matchRoutes } from 'umi';
import { message } from 'antd';
// 运行时配置

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
// export async function getInitialState(): Promise<{ name: string }> {
//   return { name: '@umijs/max' };
// }

// export const layout = () => {
//   return {
//     logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
//     menu: {
//       locale: false,
//     },
//   };
// };

export const request: RequestConfig = {
  timeout: 10000,
  errorConfig: {
    errorHandler(error: any, options: any) {
      if (options?.skipErrorHandler) throw error;
      message.error(error.response?.data?.userTip);
    },
    errorThrower(res: any) {
      console.log(res);
      //debugger;
    },
  },
  requestInterceptors: [
    (config: any) => {
      // 拦截请求配置，进行个性化处理。
      if (config.url.includes('v2api/common/Login')) {
        return config;
      } else {
        let accessToken: string | null = sessionStorage.getItem('ACCESS_TOKEN');
        let tenantCode: string | null = sessionStorage.getItem('TENANT_CODE');
        return {
          ...config,
          headers: {
            ...config.headers,
            Authorization: `Bearer ${accessToken}`,
            'Menhey-Flow-Tenant-Code': tenantCode ?? 'sfip',
            //'Menhey-Flow-Tenant-Code': 'mimp',
          },
        };
      }
    },
  ],
  responseInterceptors: [
    (response: any) => {
      if (response.status === 401) {
        history.push('/login');
        message.error('token过期，请重新登录');
        return response;
      }

      return response;
    },
  ],
};

export function onRouteChange({ clientRoutes, location }) {
  const route = matchRoutes(clientRoutes, location.pathname)?.pop()?.route;
  if (route) {
    document.title = route.title || '';
  }
}
