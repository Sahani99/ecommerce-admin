// admin/components/Login.jsx
import React from 'react';
import { Box, H1, Text, Button, FormGroup, Input, Label } from '@adminjs/design-system';

const Login = () => {
  return (
    <Box
      bg="grey100"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Box
        variant="white"
        width="400px"
        padding="xl"
        boxShadow="card"
        textAlign="center"
      >
        <H1 color="primary100">E-Shop Login</H1>
        <Text marginBottom="xl">Please sign in</Text>
        <form method="POST" action="/admin/login">
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required />
          </FormGroup>
          <Button type="submit" variant="primary" width="100%">
            Sign In
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default Login;