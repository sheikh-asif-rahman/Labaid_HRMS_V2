import React, { useEffect, useState } from "react";
import Overview_Cards from "../components/Overview/Overview_Cards/Overview_Cards";
import { API_BASE_URL } from "../constants/apiBase";
import Popup from "../components/Popup/Popup";

interface FacilityAPI {
  deviceId: string;
  deviceName: string; // branch/facility name
  totalEmployees: number;
  presentCount: number;
  absentCount: number;
  leave?: number;
}

const Overview: React.FC = () => {
  const [facilities, setFacilities] = useState<FacilityAPI[]>([]);
  const [employeeBranchName, setEmployeeBranchName] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const homeDataStr = localStorage.getItem("homeData");
      if (!homeDataStr) return;

      const homeData = JSON.parse(homeDataStr);
      const branchName = homeData.userProfile?.BranchName || "";
      setEmployeeBranchName(branchName);

      try {
        const res = await fetch(`${API_BASE_URL}overview`);
        const result = await res.json();

        if (result.success && Array.isArray(result.data)) {
          // Move user's branch to first position
          const sortedFacilities = [...result.data].sort((a, b) => {
            if (a.deviceName.trim().toLowerCase() === branchName.trim().toLowerCase())
              return -1;
            if (b.deviceName.trim().toLowerCase() === branchName.trim().toLowerCase())
              return 1;
            return 0;
          });

          setFacilities(sortedFacilities);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching overview data:", err);
        // Keep loading true if fetch fails
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {loading && <Popup isOpen={true} type="loading" />}
      {!loading && facilities.length > 0 && (
        <Overview_Cards
          facilities={facilities}
          userBranchName={employeeBranchName} // highlight by branch name
        />
      )}
    </>
  );
};

export default Overview;
