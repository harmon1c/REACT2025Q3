// Temporary stub for react-router-dom during Next.js migration
// This will be removed in later commits

export const useNavigate = (): ((url: string) => void) => {
  return (url: string): void => {
    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
  };
};

export const useLocation = (): { pathname: string; search: string } => {
  return {
    pathname: typeof window !== 'undefined' ? window.location.pathname : '/',
    search: typeof window !== 'undefined' ? window.location.search : '',
  };
};

export const useSearchParams = (): [
  URLSearchParams,
  (
    paramsOrUpdater:
      | URLSearchParams
      | ((prev: URLSearchParams) => URLSearchParams)
  ) => void,
] => {
  const searchParams =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();

  const setSearchParams = (
    paramsOrUpdater:
      | URLSearchParams
      | ((prev: URLSearchParams) => URLSearchParams)
  ): void => {
    if (typeof window !== 'undefined') {
      const newParams =
        typeof paramsOrUpdater === 'function'
          ? paramsOrUpdater(searchParams)
          : paramsOrUpdater;
      window.history.replaceState(
        {},
        '',
        `${window.location.pathname}?${newParams.toString()}`
      );
    }
  };

  return [searchParams, setSearchParams] as const;
};

export const useParams = (): Record<string, string> => {
  return {};
};

export const Link = ({
  to,
  children,
  ...props
}: {
  to: string;
  children: React.ReactNode;
  [key: string]: unknown;
}): React.JSX.Element => {
  return (
    <a href={to} {...props}>
      {children}
    </a>
  );
};

export const BrowserRouter = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode => children;
export const Routes = ({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode => children;
export const Route = ({
  element,
  children,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  path,
}: {
  element?: React.ReactNode;
  children?: React.ReactNode;
  path?: string;
}): React.ReactNode => element || children;
export const Outlet = (): null => null;
