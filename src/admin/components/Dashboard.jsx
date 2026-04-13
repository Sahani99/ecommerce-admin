// import React from 'react';
// import { Box, H2, H3, Text, Illustration } from '@adminjs/design-system';
// import { useCurrentAdmin } from 'adminjs';

// const Dashboard = (props) => {
//   console.log("CUSTOM DASHBOARD LOADED");
//   // data is the object returned from the handler in options.js
//   const data = props.dashboard ?? props.data ?? {}; 
// //   const [currentAdmin] = useCurrentAdmin();

// //   // Check if user is admin - simple direct check
// //   const isAdmin = data.isAdmin === true;
// const [currentAdmin] = useCurrentAdmin();

// const isAdmin =
//   data.isAdmin === true ||
//   currentAdmin?.role?.toLowerCase() === 'admin';

// console.log("Dashboard props:", props)
// console.log("Dashboard data:", data)
// console.log("currentAdmin:", currentAdmin)

//   return (
//     <Box padding="xl">
//       {/* Welcome Section */}
//       <Box variant="white" padding="xl" marginBottom="xl" boxShadow="card">
//         <H2>Welcome, {currentAdmin?.email || 'User'}!</H2>
//         <Text>You are logged in as: <b>{currentAdmin?.role?.toUpperCase() || 'UNKNOWN'}</b></Text>
//       </Box>

//       {isAdmin ? (
//         <Box display="flex" flexDirection="row" flexWrap="wrap" justifyContent="space-between">
//           <StatBox label="Users" value={data.userCount} />
//           <StatBox label="Orders" value={data.orderCount} />
//           <StatBox label="Products" value={data.productCount} />
//           <StatBox label="Revenue" value={`$${Number(data.revenue || 0).toFixed(2)}`} />
//         </Box>
//       ) : (
//         <Box variant="white" padding="xl" boxShadow="card">
//           <H3>General Dashboard</H3>
//           <Text>Welcome to the system. Please use the sidebar to browse available categories and products.</Text>
//         </Box>
//       )}
//     </Box>
//   );
// };

// const StatBox = ({ label, value }) => (
//   <Box variant="white" width={[1, 1/2, 1/4]} padding="lg" textAlign="center" boxShadow="card" margin="sm">
//     <H3 color="primary100">{value ?? 0}</H3>
//     <Text>{label}</Text>
//   </Box>
// );

// export default Dashboard;

// admin/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { Box, H2, H3, Text } from '@adminjs/design-system';
import { useCurrentAdmin } from 'adminjs';

const Dashboard = () => {
  const [currentAdmin] = useCurrentAdmin();
  const [stats, setStats] = useState({ userCount: 0, orderCount: 0, productCount: 0, revenue: 0 });

  useEffect(() => {
    // Fetch your dashboard stats from your newly created API
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(err => console.error("Failed to fetch stats:", err));
  }, []);

  const isAdmin = currentAdmin?.role?.toLowerCase() === 'admin';

  return (
    <Box padding="xl">
      <Box variant="white" padding="xl" marginBottom="xl" boxShadow="card">
        <H2>Welcome, {currentAdmin?.email || 'User'}!</H2>
        <Text>Role: <b>{currentAdmin?.role?.toUpperCase() || 'UNKNOWN'}</b></Text>
      </Box>

      {isAdmin ? (
        <Box display="flex" flexDirection="row" flexWrap="wrap">
          <StatBox label="Users" value={stats.userCount} />
          <StatBox label="Orders" value={stats.orderCount} />
          <StatBox label="Products" value={stats.productCount} />
          <StatBox label="Revenue" value={`$${Number(stats.revenue || 0).toFixed(2)}`} />
        </Box>
      ) : (
        <Box variant="white" padding="xl" boxShadow="card">
          <H3>General Dashboard</H3>
          <Text>Welcome to the system.</Text>
        </Box>
      )}
    </Box>
  );
};

const StatBox = ({ label, value }) => (
  <Box variant="white" width={[1, 1/2, 1/4]} padding="lg" textAlign="center" boxShadow="card" margin="sm">
    <H3 color="primary100">{value ?? 0}</H3>
    <Text>{label}</Text>
  </Box>
);

export default Dashboard;