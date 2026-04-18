// // admin/components/Dashboard.jsx
// import React, { useEffect, useState } from 'react';
// import { Box, H2, H3, Text, Illustration } from '@adminjs/design-system';
// import { ApiClient } from 'adminjs';

// const api = new ApiClient();

// const Dashboard = (props) => {
//   const [data, setData] = useState(props.data || {});

//   useEffect(() => {
//     // If props.data is empty, manually trigger the handler
//     if (!props.data || Object.keys(props.data).length === 0) {
//       api.getDashboard().then(response => {
//         setData(response.data);
//       });
//     }
//   }, [props.data]);

//   const isAdmin = data.isAdmin;

//   return (
//     <Box padding="xl">
//       <Box variant="white" padding="xl" marginBottom="xl" boxShadow="card">
//         <H2>E-Shop Control Center</H2>
//         <Text>Logged in as: <b>{data.isAdmin ? 'Administrator' : 'Staff'}</b></Text>
//       </Box>

//       {isAdmin ? (
//         <Box display="flex" flexDirection="row" flexWrap="wrap">
//           <StatBox label="Total Users" value={data.userCount} />
//           <StatBox label="Total Orders" value={data.orderCount} />
//           <StatBox label="Revenue" value={`$${data.revenue}`} />
//         </Box>
//       ) : (
//         <Box variant="white" padding="xl">
//           <H3>User Dashboard</H3>
//           <Text>Use the sidebar to manage Categories and Products.</Text>
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
import { ApiClient } from 'adminjs';

const api = new ApiClient();

const Dashboard = (props) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.getDashboard()
      .then(response => {
        // AdminJS wraps the handler return value under response.data.data
        const payload = response?.data?.data ?? response?.data ?? {};
        setData(payload);
      })
      .catch(err => console.error('Dashboard fetch error:', err));
  }, []);

  if (!data) return <Box padding="xl"><Text>Loading...</Text></Box>;

  return (
    <Box padding="xl">
      <Box variant="white" padding="xl" marginBottom="xl" boxShadow="card">
        <H2>E-Shop Control Center</H2>
        <Text>Logged in as: <b>{data.isAdmin ? 'Administrator' : `Welcome ${data.userName || 'User'}`}</b></Text>
      </Box>

      {data.isAdmin ? (
        <Box display="flex" flexDirection="row" flexWrap="wrap">
          <StatBox label="Total Users" value={data.userCount} />
          <StatBox label="Total Orders" value={data.orderCount} />
          <StatBox label="Products" value={data.productCount} />
          <StatBox label="Revenue" value={`$${Number(data.revenue).toFixed(2)}`} />
        </Box>
      ) : (
        <Box display="flex" flexDirection="row" flexWrap="wrap">
          <StatBox label="My Orders" value={data.orderCount} />
          <StatBox label="My Order Items" value={data.orderItems} />
          <StatBox label="Available Products" value={data.availableProducts?.length || 0} />
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