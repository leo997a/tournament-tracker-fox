
import { useMemo } from "react";
import { useTournamentStore } from "@/store/tournamentStore";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import TeamLogo from "./TeamLogo";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";
import { Download } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface GroupTableProps {
  group: string;
  showControls?: boolean;
}

const GroupTable = ({ group, showControls = true }: GroupTableProps) => {
  const { teams, standings, tournamentName, organizer, copyright, getCopyrightInfo } = useTournamentStore();
  const isMobile = useIsMobile();
  
  const groupTeams = useMemo(() => {
    return teams.filter(team => team.group === group);
  }, [teams, group]);
  
  const groupStandings = useMemo(() => {
    // Ensure standings are sorted by points first, then goal difference
    const standsForGroup = standings[group] || [];
    return [...standsForGroup].sort((a, b) => {
      // Sort by points (descending)
      if (a.points !== b.points) {
        return b.points - a.points;
      }
      
      // If points are equal, sort by goal difference (descending)
      const aGD = a.goalsFor - a.goalsAgainst;
      const bGD = b.goalsFor - b.goalsAgainst;
      if (aGD !== bGD) {
        return bGD - aGD;
      }
      
      // If goal difference is equal, sort by goals scored (descending)
      return b.goalsFor - a.goalsFor;
    });
  }, [standings, group]);

  const downloadAsImage = () => {
    const element = document.getElementById(`group-${group}-table`);
    if (element) {
      html2canvas(element, { 
        backgroundColor: '#0f1e45',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
      }).then(canvas => {
        // Add tournament name and group to the canvas
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.font = 'bold 20px Arial';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'right';
          ctx.fillText(`المجموعة ${group} - ${tournamentName}`, canvas.width - 20, canvas.height - 20);
          
          if (organizer) {
            ctx.font = '16px Arial';
            ctx.fillText(organizer, canvas.width - 20, canvas.height - 40);
          }
        }
        
        canvas.toBlob(blob => {
          if (blob) {
            saveAs(blob, `مجموعة-${group}-${tournamentName}.png`);
          }
        });
      });
    }
  };

  if (groupTeams.length === 0) {
    return <div className="text-center p-4">لا توجد فرق في هذه المجموعة</div>;
  }

  return (
    <div className="space-y-4 glassmorphism p-4 bg-gradient-to-br from-tournament-navy to-tournament-blue/80 rounded-lg shadow-lg border border-tournament-accent/20">
      <div id={`group-${group}-table`} className="rounded-md overflow-hidden">
        {/* Group Header - Styled like reference image */}
        <div className="bg-tournament-darkNavy py-6 px-4 relative">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center">المجموعة {group}</h1>
          
          {/* Decorative elements from the reference design */}
          <div className="absolute top-[40%] left-0 w-32 h-1 bg-tournament-pink"></div>
          <div className="absolute top-1/4 right-0 w-1 h-1 rounded-full bg-tournament-accent"></div>
          <div className="absolute bottom-1/4 right-12 w-20 md:w-40 h-1 bg-tournament-accent/60"></div>
        </div>
        
        {/* Teams Header */}
        <div className="bg-tournament-pink text-white text-center py-3">
          <h2 className="text-xl font-bold">الفرق</h2>
        </div>
        
        {/* Team List */}
        <div>
          {groupStandings.map((standing, index) => {
            const team = teams.find(t => t.id === standing.teamId);
            if (!team) return null;
            
            return (
              <div key={team.id} className="flex flex-wrap md:flex-nowrap items-center bg-tournament-navy border-b border-tournament-navy/70">
                {/* Position indicator */}
                <div className="w-12 h-12 md:w-16 md:h-16 bg-tournament-pink flex items-center justify-center">
                  <span className="text-xl font-bold text-white">
                    {index + 1}
                  </span>
                </div>
                
                {/* Team logo */}
                <div className="w-16 h-16 md:w-24 md:h-24 p-2 flex items-center justify-center">
                  <TeamLogo teamId={team.id} size={isMobile ? "md" : "lg"} className="border-4 border-white/10 rounded-full bg-white/10" />
                </div>
                
                {/* Team name */}
                <div className="flex-1 p-2 md:p-4">
                  <h3 className="text-xl md:text-2xl font-bold text-white">{team.name}</h3>
                </div>
                
                {/* Stats */}
                <div className="w-full md:w-auto text-right p-2 md:p-4 text-white text-sm">
                  <div className="grid grid-cols-3 md:grid-cols-1 gap-2 md:space-y-1">
                    <div>النقاط: <span className="font-bold text-lg">{standing.points}</span></div>
                    <div>عدد المباريات: <span className="font-bold">{standing.played}</span></div>
                    <div>ف/ت/خ: <span className="font-bold">{standing.won}/{standing.drawn}/{standing.lost}</span></div>
                    <div>له/عليه: <span className="font-bold">{standing.goalsFor}/{standing.goalsAgainst}</span></div>
                    <div>فارق الأهداف: <span className="font-bold text-tournament-accent">{standing.goalsFor - standing.goalsAgainst}</span></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Detailed Stats Table - Made fully responsive */}
        <div className="bg-tournament-darkNavy p-4">
          <div className="w-full overflow-visible">
            <table className="w-full border-collapse">
              <thead className="bg-tournament-pink text-white">
                <tr>
                  <th className="p-2 text-center">المركز</th>
                  <th className="p-2 text-right">الفريق</th>
                  <th className="p-2 text-center">مباريات</th>
                  <th className="p-2 text-center">فوز</th>
                  <th className="p-2 text-center">تعادل</th>
                  <th className="p-2 text-center">خسارة</th>
                  <th className="p-2 text-center">له</th>
                  <th className="p-2 text-center">عليه</th>
                  <th className="p-2 text-center">+/-</th>
                  <th className="p-2 text-center">نقاط</th>
                </tr>
              </thead>
              <tbody>
                {groupStandings.map((standing, index) => {
                  const team = teams.find(team => team.id === standing.teamId);
                  if (!team) return null;
                  
                  return (
                    <tr key={team.id} className="bg-tournament-navy border-b border-tournament-navy/70">
                      <td className="p-2 text-center font-bold text-white">{index + 1}</td>
                      <td className="p-2">
                        <div className="flex items-center gap-2">
                          <TeamLogo teamId={team.id} size="sm" />
                          <span className="text-white whitespace-nowrap">{team.name}</span>
                        </div>
                      </td>
                      <td className="p-2 text-center text-white">{standing.played}</td>
                      <td className="p-2 text-center text-white">{standing.won}</td>
                      <td className="p-2 text-center text-white">{standing.drawn}</td>
                      <td className="p-2 text-center text-white">{standing.lost}</td>
                      <td className="p-2 text-center text-white">{standing.goalsFor}</td>
                      <td className="p-2 text-center text-white">{standing.goalsAgainst}</td>
                      <td className="p-2 text-center text-white">{standing.goalsFor - standing.goalsAgainst}</td>
                      <td className="p-2 text-center font-bold text-white">{standing.points}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* For mobile, show a more compact version of the table */}
        {isMobile && (
          <div className="bg-tournament-darkNavy p-4 md:hidden">
            {groupStandings.map((standing, index) => {
              const team = teams.find(team => team.id === standing.teamId);
              if (!team) return null;
              
              return (
                <div key={team.id} className="mb-4 p-3 bg-tournament-navy rounded-md">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-tournament-pink flex items-center justify-center rounded-full mr-2">
                      <span className="text-sm font-bold text-white">{index + 1}</span>
                    </div>
                    <TeamLogo teamId={team.id} size="sm" />
                    <h3 className="mr-2 text-lg font-bold">{team.name}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>مباريات: <span className="font-bold">{standing.played}</span></div>
                    <div>نقاط: <span className="font-bold">{standing.points}</span></div>
                    <div>فوز/تعادل/خسارة: <span className="font-bold">{standing.won}/{standing.drawn}/{standing.lost}</span></div>
                    <div>له/عليه: <span className="font-bold">{standing.goalsFor}/{standing.goalsAgainst}</span></div>
                    <div className="col-span-2">فارق الأهداف: <span className="font-bold text-tournament-accent">{standing.goalsFor - standing.goalsAgainst}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Copyright and Decorative bottom elements */}
        <div className="bg-tournament-darkNavy py-4 px-4 relative">
          <div className="text-right text-tournament-accent/80 text-sm">
            {copyright || getCopyrightInfo()}
          </div>
          <div className="absolute bottom-0 right-0 w-40 h-1 bg-tournament-accent"></div>
          <div className="absolute bottom-8 left-8 w-40 h-1 bg-tournament-pink"></div>
        </div>
      </div>
      
      {showControls && (
        <div className="flex justify-end mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={downloadAsImage} 
            className="flex items-center gap-1"
          >
            <Download size={16} />
            <span>تحميل ترتيب المجموعة {group}</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default GroupTable;
