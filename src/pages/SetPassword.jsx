import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { setPassword } from "../services/authService";

export const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPasswordValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError("Invalid Invitation Link");
      return;
    }

    if (password.length < 6) {
      setError("Password must be atleast 6 characters");
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
                type="password"
                value={password}
                onChange={(e) => setPasswordValue(e.target.value)}
                margin="normal"
                required
                helperText="Password must be at least 6 characters."
              />

              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                margin="normal"
                required
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={loading}
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
