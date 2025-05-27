export interface AuthReturnInterface {
  success: boolean;
  message: string;
  status: number;
  data: { access_token: string; refresh_token: string };
}
