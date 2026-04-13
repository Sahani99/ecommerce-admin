import React from 'react';
import { Box, H2, Text, Table, TableHead, TableBody, TableRow, TableCell, Button, Icon, Badge } from '@adminjs/design-system';
import { useNavigate, ViewHelpers } from 'adminjs';

const SettingsList = (props) => {
  const { records, resource } = props;
  const navigate = useNavigate();
  const h = new ViewHelpers();

  // Function to navigate to the edit page for a specific record
  const handleEdit = (recordId) => {
    // Generates the URL for the edit action of this resource
    const editUrl = h.recordActionUrl({
      resourceId: resource.id,
      recordId,
      actionName: 'edit',
    });
    navigate(editUrl);
  };

    return (
    <Box padding="xl">
      <Box variant="white" padding="xl" marginBottom="xl" boxShadow="card" borderRadius="lg">
        <H2>System Settings</H2>
        <Text color="grey60">Manage global application variables and configuration.</Text>
      </Box>

      <Box variant="white" boxShadow="card" borderRadius="lg">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Text fontWeight="bold">Key</Text></TableCell>
              <TableCell><Text fontWeight="bold">Value</Text></TableCell>
              <TableCell><Text fontWeight="bold">Description</Text></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {records.map((record) => (
              <TableRow key={record.id}>
                <TableCell><Text fontWeight="bold">{record.params.key}</Text></TableCell>
                <TableCell><Text color="primary100">{record.params.value}</Text></TableCell>
                <TableCell><Text color="grey60">{record.params.description}</Text></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

// Small helper component for the Value column to look like code
const CodeValue = ({ children }) => (
  <Box 
    as="span" 
    backgroundColor="grey20" 
    padding="xs" 
    px="sm" 
    borderRadius="md" 
    style={{ fontFamily: 'monospace', color: '#d5267d' }}
  >
    {children}
  </Box>
);

export default SettingsList;