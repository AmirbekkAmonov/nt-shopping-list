import React, { useEffect, useState } from "react";
import { useMyGroups } from "@/hooks/useGroups";
import { useNavigate } from "react-router-dom";
import { Spin, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faCalendarAlt, faUser, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useTheme } from "@/hooks/useTheme";
function GroupsPage() {
  const { darkMode } = useTheme();
  const { myGroups, isLoadingMyGroups } = useMyGroups();
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (myGroups) {
      setGroups(myGroups);
    }
  }, [myGroups]);

  const formatDate = (iso) => {
    const date = new Date(iso);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className={`my-groups-page ${darkMode ? 'dark' : ''}`}>
      <h2 className="my-groups-page__title">My Groups</h2>

      {isLoadingMyGroups ? (
        <Spin className="my-groups-page__spin" size="large" />
      ) : groups.length === 0 ? (
        <p className="my-groups-page__empty">No groups found.</p>
      ) : (
        <div className="groups-list">
          {groups.map((group) => (
            <div 
              key={group._id} 
              className="group-item"
              onClick={() => navigate(`/groups/${group._id}`)}
            >
              <div className="group-item__main">
                <h3 className="group-item__title">{group.name}</h3>
                <div className="group-item__info">
                  <span className="group-item__owner">
                    <FontAwesomeIcon icon={faUser} />
                    {group.owner?.name}
                  </span>
                  <span className="group-item__date">
                    <FontAwesomeIcon icon={faCalendarAlt} />
                    {formatDate(group.createdAt)}
                  </span>
                  <span className="group-item__members">
                    <FontAwesomeIcon icon={faUsers} />
                    {group.members.length} members
                  </span>
                  <Button 
                    type="primary"
                    className="group-item__button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/groups/${group._id}`);
                    }}
                  >
                    <FontAwesomeIcon icon={faArrowRight} />
                    Kirish
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GroupsPage;
