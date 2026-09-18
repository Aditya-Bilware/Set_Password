import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  InputAdornment,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { setPassword } from "../services/authService";

const Requirement = ({ valid, children }) => (
  <Typography
    variant="body"
    sx={{
      color: valid ? "success.main" : "text.secondary",
      display: "flex",
      alignItems: "center",
      mb: "0.7",
    }}
  >
    <Box
      component="span"
      sx={{
        width: 20,
        display: "inline-block",
        fontWeight: 700,
        color: valid ? "success.main" : "text.secondary",
      }}
    >
      {valid ? "✓" : "o"}
    </Box>
    {children}
  </Typography>
);

export const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPasswordValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRequirements = {
    minLength: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const isPasswordValid =
    passwordRequirements.minLength &&
    passwordRequirements.lowercase &&
    passwordRequirements.uppercase &&
    passwordRequirements.number &&
    passwordRequirements.special;

  const passwordMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError("Invalid Invitation Link");
      return;
    }

    if (!isPasswordValid) {
      setError("Please meet all password requirements");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await setPassword(token, password);

      setSuccess(
        "Password set successfully. You can now log in to your account",
      );

      setPasswordValue("");
      setConfirmPassword("");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to set password. The invitation may be invalid or expired";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      className="min-h-screen flex items-center justify-center"
      sx={{
        backgroundColor: "#f5f7fa",
        padding: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            padding: { xs: 3, sm: 5 },
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            textAlign="center"
            fontWeight={600}
            gutterBottom
          >
            Set Your Password
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ mb: 4 }}
          >
            Create a password to activate your Book Processing Platform account.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          {!success && (
            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPasswordValue(e.target.value);
                  setError("");
                }}
                margin="normal"
                required
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          sx={{
                            minWidth: "auto",
                            textTransform: "none",
                            fontSize: "0.85rem",
                          }}
                        >
                          {showPassword ? "Hide" : "Show"}
                        </Button>
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Box
                sx={{
                  mt: 1,
                  mb: 2,
                  px: 1,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{
                    mb: 1,
                  }}
                >
                  Password Requirements
                </Typography>

                <Requirement valid={passwordRequirements.minLength}>
                  At least 8 characters
                </Requirement>
                <Requirement valid={passwordRequirements.uppercase}>
                  At least one uppercase character
                </Requirement>
                <Requirement valid={passwordRequirements.lowercase}>
                  At least one lowercase character
                </Requirement>
                <Requirement valid={passwordRequirements.number}>
                  At least one number
                </Requirement>
                <Requirement valid={passwordRequirements.special}>
                  At least one special character
                </Requirement>
              </Box>

              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError("");
                }}
                margin="normal"
                required
                autoComplete="new-password"
                error={confirmPassword.length > 0 && !passwordMatch}
                helperText={
                  confirmPassword.length > 0
                    ? passwordMatch
                      ? "Password match"
                      : "Password do not match"
                    : ""
                }
                FormHelperTextProps={{
                  sx: {
                    color:
                      confirmPassword.length > 0 && passwordMatch
                        ? "success.main"
                        : undefined,
                  },
                }}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          sx={{
                            minWidth: "auto",
                            textTransform: "none",
                            fontSize: "0.85rem",
                          }}
                        >
                          {showConfirmPassword ? "Hide" : "Show"}
                        </Button>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading && !isPasswordValid && !passwordMatch}
                sx={{
                  mt: 3,
                  py: 1.4,
                  textTransform: "none",
                  fontSize: "1rem",
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Set Password"
                )}
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};
