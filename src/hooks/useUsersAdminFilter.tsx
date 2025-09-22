import { useState, useEffect, useMemo } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'expired' | 'suspended';
  expires: string;
  avatar?: string;
  created_at?: string;
  last_login?: string;
}

interface UseUsersAdminFilterProps {
  users: User[];
}

export const useUsersAdminFilter = ({ users }: UseUsersAdminFilterProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<'active' | 'expired' | 'suspended' | null>(null);
  const [selectedRole, setSelectedRole] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Extract roles dynamically from users
  const availableRoles = useMemo(() => {
    const roleSet = new Set<string>();
    users.forEach(user => {
      if (user.role && user.role.trim()) {
        roleSet.add(user.role.trim());
      }
    });
    
    const sortedRoles = Array.from(roleSet).sort();
    return [
      { value: "all", label: "Todos os Cargos" },
      ...sortedRoles.map(role => ({
        value: role.toLowerCase().replace(/\s+/g, '_'),
        label: role
      }))
    ];
  }, [users]);

  // Filter users based on criteria
  const filteredUsers = useMemo(() => {
    let result = users;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status (from topbar tabs)
    if (selectedStatus !== null) {
      result = result.filter(user => user.status === selectedStatus);
    }

    // Filter by role
    if (selectedRole !== "all") {
      result = result.filter(user => {
        const normalizedRole = user.role.toLowerCase().replace(/\s+/g, '_');
        return normalizedRole === selectedRole;
      });
    }

    return result;
  }, [users, searchTerm, selectedStatus, selectedRole]);

  // Get status counts for stats cards
  const statusCounts = useMemo(() => {
    return {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      expired: users.filter(u => u.status === 'expired').length,
      suspended: users.filter(u => u.status === 'suspended').length
    };
  }, [users]);

  const handleSearchChange = (value: string) => {
    setIsLoading(true);
    setSearchTerm(value);
    setTimeout(() => setIsLoading(false), 200);
  };

  const handleStatusChange = (status: 'active' | 'expired' | 'suspended' | null) => {
    setIsLoading(true);
    setSelectedStatus(status);
    setTimeout(() => setIsLoading(false), 200);
  };

  const handleRoleChange = (role: string) => {
    setIsLoading(true);
    setSelectedRole(role);
    setTimeout(() => setIsLoading(false), 200);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedStatus(null);
    setSelectedRole("all");
  };

  return {
    searchTerm,
    selectedStatus,
    selectedRole,
    filteredUsers,
    availableRoles,
    statusCounts,
    isLoading,
    handleSearchChange,
    handleStatusChange,
    handleRoleChange,
    resetFilters
  };
};