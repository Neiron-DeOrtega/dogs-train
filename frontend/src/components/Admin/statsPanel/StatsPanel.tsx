import { useState } from "react";
import { StatsSearch } from "./StatsSearch";
import { StatsView } from "./StatsView";

const StatsPanel = () => {

    const [stats, setStats] = useState<{dogName: string, averageRating: number}[]>()

    return (
        <div className="admin-wrapper">
            <StatsSearch setStats={setStats}/>
            <StatsView stats={stats}/>
        </div>
    );
};

export default StatsPanel;
