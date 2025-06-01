import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { useStore } from "@/hooks/useStore";
import { FaUser, FaCog, FaLock, FaPowerOff, FaEllipsisV, FaUsers, FaPlus } from "react-icons/fa";
import { Collapse, Button, Drawer, Form, Input, List, message } from "antd";
import useAuth from "@/hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { useMyGroups, useCreateGroup } from "@/hooks/useGroups";

function Sidebar() {
  const { darkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const user = useStore((state) => state.user);
  const { logout } = useAuth();
  const groups = useStore((state) => state.groups);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form] = Form.useForm();
  const createGroup = useCreateGroup();

  const { myGroups, isLoadingMyGroups, refetch } = useMyGroups();
  const [joinedGroups, setJoinedGroups] = useState([]);

  const prevGroupsRef = useRef(myGroups);

  useEffect(() => {
    if (prevGroupsRef.current !== myGroups) {
      setJoinedGroups(myGroups);
      prevGroupsRef.current = myGroups;
    }
  }, [myGroups]);


  const navigate = useNavigate();
  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleAddGroup = async (values) => {
    try {
      const existingGroup = myGroups.find((group) => group.name === values.name);
      if (existingGroup) {
        message.error("A group with this name already exists!");
        return;
      }
      await createGroup.mutateAsync({ name: values.name, password: values.password });
        form.resetFields();
      setDrawerOpen(false);
      await refetch(); 
    } catch (error) {
      console.error("Error creating group:", error.response?.data || error.message);
      message.error(`Error: ${error.response?.data?.message || "Unknown error"}`);
    }
  };
  

  return (
    <div className={`sidebar ${darkMode ? "dark" : ""}`}>
      <Link className="logo" to="/">GroupMart</Link>
      <div className="sidebar-content">
        <div className="profile">
          <img src="avatar.jpg" alt="Profile" className="avatar" />
          <div className="info">
            <h4>{user ? user.name : "Guest"}</h4>
            <p>{user ? `@${user.username}` : "No username"}</p>
          </div>
          <button className="menu-btn" onClick={() => setIsOpen(!isOpen)}>
            <FaEllipsisV />
          </button>
        </div>
        <div className={`dropdown ${isOpen ? "open" : ""}`}>
          <ul>
            <li onClick={() => handleNavigation("/profile")}>
              <FaUser /> My Account
            </li>
            <li onClick={() => handleNavigation("/settings")}>
              <FaCog /> Settings
            </li>
            <li onClick={() => handleNavigation("/lock-screen")}>
              <FaLock /> Lock Screen
            </li>
            <li onClick={logout}>
              <FaPowerOff /> Logout
            </li>
          </ul>
        </div>
      </div>

      <Collapse
        style={{ marginTop: "10px" }}
        className="sidebar-collapse"
        defaultActiveKey={["1"]}
        items={[
          {
            key: "1",
            label: (
              <div className="collapse-label">
                <FaUsers /> Groups
              </div>
            ),
            children: (
              <>
                <Button
                  type="primary"
                  icon={<FaPlus />}
                  block
                  style={{ marginBottom: "10px" }}
                  onClick={() => setDrawerOpen(true)}
                >
                  Add Group
                </Button>

                <List
                  style={{ overflow: "hidden" }}
                  size="small"
                  bordered
                  loading={isLoadingMyGroups}
                  dataSource={[...(groups || []), ...(myGroups || [])]}
                  renderItem={(group) => (
                    <List.Item onClick={() => navigate(`/groups/${group._id || "default"}`)} style={{ cursor: "pointer" }} className="group-item">
                      <strong>{group?.name || "No Name"}</strong>
                    </List.Item>
                  )}
                />
              </>
            ),
          },
        ]}
      />
<Drawer
        title="Add New Group"
        placement="right"
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        className="custom-dark-drawer"
      >
        <Form form={form} onFinish={handleAddGroup} layout="vertical">
          <Form.Item
            name="name"
            label="Group Name"
            rules={[{ required: true, message: "Please enter the group name!" }]}
          >
            <Input placeholder="Enter group name..." />
          </Form.Item>
          <Form.Item
            name="password"
            label="Group Password"
            rules={[{ required: true, message: "Please enter the group password!" }]}
          >
            <Input.Password placeholder="Enter password..." style={{ padding: "8px" }} />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>
            Add
          </Button>
        </Form>
      </Drawer>
    </div>
  );
}

export default Sidebar;
