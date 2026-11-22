import { useState, type FormEvent } from 'react'
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { ArrowRight, Eye, EyeOff, FileText, LockKeyhole, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import api from '@/api services/api';

const roleRoutes: Record<string, string> = {
  admin: "/admin",
  "Super admin": "/admin",
};

type LoginResponse = {
  statusCode?: number;
  message?: string;
  user_role?: string;
  data?: { user_role?: string };
  componentData?: { data?: { user_role?: string } };
  componenData?: { data?: { user_role?: string } };
};


function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false)
  const navigation = useNavigate();
  const [passwordError, setPasswordError] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const [formError, setFormError] = useState<string>("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true)
    setFormError("");
    setEmailError("");
    setPasswordError("");
    try {
      const { data: responseData } = await api.post<LoginResponse>("/login", { email, password })
      if (responseData.statusCode === 401) {
        setPasswordError(responseData.message || "Invalid email or password");
        return;
      }
      const userRole = responseData.user_role
        ?? responseData.data?.user_role
        ?? responseData.componentData?.data?.user_role
        ?? responseData.componenData?.data?.user_role;
      if (!userRole) {
        setFormError("Sign in succeeded, but the response did not include a user role.");
        return;
      }
      const destination = roleRoutes[userRole];
      if (!destination) {
        setFormError(`No application is configured for the “${userRole}” role.`);
        return;
      }
      navigation(destination);
    } catch (error: unknown) {
      const message = isAxiosError<LoginResponse>(error)
        ? error.response?.data?.message || error.message
        : error instanceof Error ? error.message : "Sign in failed. Please try again.";
      setFormError(message);
    } finally {
      setLoading(false);
    }
  }

  const brand = (
    <Stack component="a" href="#" direction="row" alignItems="center" spacing={1.25} className="brand" aria-label="PDFly home">
      <Box className="brand-mark"><FileText size={21} strokeWidth={2.4} /></Box>
      <Box component="span">pdf<Box component="span" className="brand-accent">ly</Box></Box>
    </Stack>
  )

  return (
    <Box component="main" className="login-page">
      <Box component="section" className="login-visual" aria-label="PDF tools">
        {brand}

        <Box className="visual-copy">
          <Typography component="div" className="eyebrow"><Box component="span" className="eyebrow-dot" /> YOUR DOCUMENTS, SIMPLIFIED</Typography>
          <Typography component="h1">Everything you need<br />to work with DOCUMENTs.</Typography>
          <Typography component="p">Convert, edit, and manage your documents with tools designed to make your workday a little easier.</Typography>

          <Box className="document-art" aria-hidden="true">
            <Box className="art-glow" />
            <Box className="art-card art-card-back"><i /><i /><i /></Box>
            <Box className="art-card art-card-front">
              <Box className="art-file-icon"><FileText size={23} /></Box>
              <Box className="art-line art-line-long" /><Box className="art-line art-line-short" />
              <Box className="art-rule" />
              <Box className="art-row"><span /><span /></Box><Box className="art-row"><span /><span /></Box>
              <Box className="art-signature" />
            </Box>
            <Box className="art-badge"><Box component="span">✓</Box> Ready to share</Box>
            <Box className="art-sparkle sparkle-one">✦</Box><Box className="art-sparkle sparkle-two">✧</Box>
          </Box>
        </Box>

        <Stack className="visual-footer" direction="row" justifyContent="space-between">
          <Typography component="span">Simple tools. Better workflow.</Typography>
          <Typography component="span">© 2025 PDFly</Typography>
        </Stack>
      </Box>

      <Box component="section" className="login-panel">
        <Box className="mobile-brand">{brand}</Box>
        <Box className="login-content">
          <Box className="form-heading">
            <Typography component="span" className="welcome-label">WELCOME BACK</Typography>
            <Typography component="h2">Sign in to your account</Typography>
            <Typography component="p">Pick up right where you left off.</Typography>
          </Box>

          <Stack component="form" className="login-form" spacing={0} onSubmit={handleSubmit}>
            <Typography component="label" htmlFor="email" className="field-label">Email address</Typography>
            <TextField
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
                error={email ? true : false}
             helperText={passwordError}
              onChange={(event) => setEmail(event.target.value)}
              required
              fullWidth
              size="small"
              InputProps={{
                startAdornment: <InputAdornment position="start"><Mail size={18} /></InputAdornment>,
              }}
            />

            <Stack className="password-label-row" direction="row" justifyContent="space-between" alignItems="center">
              <Typography component="label" htmlFor="password" className="field-label">Password</Typography>
              <Link className="text-link" href="#forgot-password" underline="hover">Forgot password?</Link>
            </Stack>
            <TextField
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="Enter your password"
              error={passwordError ? true : false}
              value={password}
              helperText={passwordError}
              onChange={(event) => setPassword(event.target.value)}
              required
              fullWidth
              size="small"
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockKeyhole size={18} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              className="remember-row"
              control={<Checkbox name="remember" size="small" />}
              label="Keep me signed in"
            />
            <Button loading={loading} className="submit-button" type="submit" variant="contained" fullWidth endIcon={<ArrowRight size={18} />}>
              Sign in
            </Button>
            {formError && <Typography role="alert" color="error">{formError}</Typography>}
          </Stack>

          <Typography component="p" className="signup-prompt">
            Don’t have an account? <Link className="text-link" href="#sign-up" underline="hover">Create one</Link>
          </Typography>
          <Stack className="security-note" direction="row" alignItems="center" justifyContent="center" spacing={0.75}>
            <LockKeyhole size={14} /><Typography component="span">Your documents are encrypted and secure</Typography>
          </Stack>
        </Box>
        <Stack component="footer" className="panel-footer" direction="row" spacing={3}>
          <Link href="#privacy" underline="hover">Privacy</Link><Link href="#terms" underline="hover">Terms</Link><Link href="#help" underline="hover">Help center</Link>
        </Stack>
      </Box>
    </Box>
  )
}

export default Login
