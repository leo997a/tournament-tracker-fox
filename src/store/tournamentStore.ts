
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Team, Player, Match, GroupStanding, KnockoutMatch } from '../types';
import { database } from '../lib/firebase';
import { ref, set, get, onValue, off } from 'firebase/database';
import { toast } from 'sonner';

const initialTeams: Team[] = [
  { id: 'khoyada-a', name: 'KHOYADA A', logo: 'https://i.postimg.cc/SxzdLgD6/35.png', group: 'A' },
  { id: 'barwar-b', name: 'BARWAR B', logo: 'https://www2.0zz0.com/2025/03/16/18/214508191.jpg', group: 'A' },
  { id: 'hakkare', name: 'HAKKARE', logo: 'https://www2.0zz0.com/2025/03/16/18/177671746.png', group: 'A' },
  
  { id: 'barwar-a', name: 'BARWAR A', logo: 'https://www2.0zz0.com/2025/03/16/18/322348416.jpg', group: 'B' },
  { id: 'nergal', name: 'NERGAL', logo: 'https://www2.0zz0.com/2025/03/16/18/844566857.png', group: 'B' },
  { id: 'mangesh', name: 'MANGESH', logo: 'https://www2.0zz0.com/2025/03/16/18/314810508.png', group: 'B' },
  
  { id: 'rafiden', name: 'RAFIDEN', logo: 'https://www2.0zz0.com/2025/03/16/18/729221934.png', group: 'C' },
  { id: 'gaznakh', name: 'GAZNAKH', logo: 'https://www2.0zz0.com/2025/03/16/18/125590941.png', group: 'C' },
  { id: 'batnaye', name: 'BATNAYE', logo: 'https://www2.0zz0.com/2025/03/16/18/212549849.png', group: 'C' },
  
  { id: 'nala', name: 'NALA', logo: 'https://www2.0zz0.com/2025/03/16/18/840537525.png', group: 'D' },
  { id: 'karanjo', name: 'KARANJO', logo: 'https://www2.0zz0.com/2025/03/16/18/840544347.png', group: 'D' },
  { id: 'khoyada-b', name: 'KHOYADA B', logo: 'https://www2.0zz0.com/2025/03/16/18/281866893.png', group: 'D' },
];

const initialMatches: Match[] = [
  { 
    id: 'day1-match1', 
    homeTeamId: 'khoyada-a', 
    awayTeamId: 'barwar-b', 
    homeScore: 1, 
    awayScore: 1, 
    date: '2025-03-14', 
    time: '14:00', 
    status: 'upcoming', 
    stage: 'group',
    group: 'A',
    yellowCards: { homeTeam: 0, awayTeam: 0 },
    redCards: { homeTeam: 0, awayTeam: 0 }
  },
  { 
    id: 'day1-match2', 
    homeTeamId: 'rafiden', 
    awayTeamId: 'gaznakh', 
    homeScore: null, 
    awayScore: null, 
    date: '2025-03-14', 
    time: '15:00', 
    status: 'upcoming', 
    stage: 'group',
    group: 'C',
    yellowCards: { homeTeam: 0, awayTeam: 0 },
    redCards: { homeTeam: 0, awayTeam: 0 }
  },
  { 
    id: 'day1-match3', 
    homeTeamId: 'nala', 
    awayTeamId: 'khoyada-b', 
    homeScore: null, 
    awayScore: null, 
    date: '2025-03-14', 
    time: '16:00', 
    status: 'upcoming', 
    stage: 'group',
    group: 'D',
    yellowCards: { homeTeam: 0, awayTeam: 0 },
    redCards: { homeTeam: 0, awayTeam: 0 }
  },
  
  { 
    id: 'day2-match1', 
    homeTeamId: 'barwar-a', 
    awayTeamId: 'mangesh', 
    homeScore: 5, 
    awayScore: 2, 
    date: '2025-03-16', 
    time: '15:00', 
    status: 'upcoming', 
    stage: 'group',
    group: 'B',
    yellowCards: { homeTeam: 0, awayTeam: 0 },
    redCards: { homeTeam: 0, awayTeam: 0 }
  },
  { 
    id: 'day2-match2', 
    homeTeamId: 'batnaye', 
    awayTeamId: 'gaznakh', 
    homeScore: null, 
    awayScore: null, 
    date: '2025-03-16', 
    time: '16:00', 
    status: 'upcoming', 
    stage: 'group',
    group: 'C',
    yellowCards: { homeTeam: 0, awayTeam: 0 },
    redCards: { homeTeam: 0, awayTeam: 0 }
  },
  { 
    id: 'day2-match3', 
    homeTeamId: 'karanjo', 
    awayTeamId: 'khoyada-b', 
    homeScore: null, 
    awayScore: null, 
    date: '2025-03-16', 
    time: '17:00', 
    status: 'upcoming', 
    stage: 'group',
    group: 'D',
    yellowCards: { homeTeam: 0, awayTeam: 0 },
    redCards: { homeTeam: 0, awayTeam: 0 }
  },
  
  { 
    id: 'day3-match1', 
    homeTeamId: 'hakkare', 
    awayTeamId: 'barwar-b', 
    homeScore: null, 
    awayScore: null, 
    date: '2025-03-18', 
    time: '15:00', 
    status: 'upcoming', 
    stage: 'group',
    group: 'A',
    yellowCards: { homeTeam: 0, awayTeam: 0 },
    redCards: { homeTeam: 0, awayTeam: 0 }
  },
  { 
    id: 'day3-match2', 
    homeTeamId: 'nergal', 
    awayTeamId: 'mangesh', 
    homeScore: null, 
    awayScore: null, 
    date: '2025-03-18', 
    time: '16:00', 
    status: 'upcoming', 
    stage: 'group',
    group: 'B',
    yellowCards: { homeTeam: 0, awayTeam: 0 },
    redCards: { homeTeam: 0, awayTeam: 0 }
  },
  { 
    id: 'day3-match3', 
    homeTeamId: 'rafiden', 
    awayTeamId: 'batnaye', 
    homeScore: null, 
    awayScore: null, 
    date: '2025-03-18', 
    time: '17:00', 
    status: 'upcoming', 
    stage: 'group',
    group: 'C',
    yellowCards: { homeTeam: 0, awayTeam: 0 },
    redCards: { homeTeam: 0, awayTeam: 0 }
  },
  
  { 
    id: 'day4-match1', 
    homeTeamId: 'khoyada-a', 
    awayTeamId: 'hakkare', 
    homeScore: null, 
    awayScore: null, 
    date: '2025-03-20', 
    time: '15:00', 
    status: 'upcoming', 
    stage: 'group',
    group: 'A',
    yellowCards: { homeTeam: 0, awayTeam: 0 },
    redCards: { homeTeam: 0, awayTeam: 0 }
  },
  { 
    id: 'day4-match2', 
    homeTeamId: 'barwar-a', 
    awayTeamId: 'nergal', 
    homeScore: null, 
    awayScore: null, 
    date: '2025-03-20', 
    time: '16:00', 
    status: 'upcoming', 
    stage: 'group',
    group: 'B',
    yellowCards: { homeTeam: 0, awayTeam: 0 },
    redCards: { homeTeam: 0, awayTeam: 0 }
  },
  { 
    id: 'day4-match3', 
    homeTeamId: 'nala', 
    awayTeamId: 'karanjo', 
    homeScore: null, 
    awayScore: null, 
    date: '2025-03-20', 
    time: '17:00', 
    status: 'upcoming', 
    stage: 'group',
    group: 'D',
    yellowCards: { homeTeam: 0, awayTeam: 0 },
    redCards: { homeTeam: 0, awayTeam: 0 }
  },
];

const initialPlayers: Player[] = [
  { id: 'player1', name: 'لاعب 1', teamId: 'khoyada-a', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
  { id: 'player2', name: 'لاعب 2', teamId: 'khoyada-a', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
  { id: 'player3', name: 'لاعب 3', teamId: 'barwar-b', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
  { id: 'player4', name: 'لاعب 4', teamId: 'barwar-b', goals: 0, assists: 0, yellowCards: 0, redCards: 0 },
];

const initialKnockoutMatches: KnockoutMatch[] = [
  { id: 'qf1', position: 'QF1', teamAId: null, teamBId: null, teamAScore: null, teamBScore: null, winner: null, nextMatchId: 'sf1', stage: 'quarterfinal' },
  { id: 'qf2', position: 'QF2', teamAId: null, teamBId: null, teamAScore: null, teamBScore: null, winner: null, nextMatchId: 'sf1', stage: 'quarterfinal' },
  { id: 'qf3', position: 'QF3', teamAId: null, teamBId: null, teamAScore: null, teamBScore: null, winner: null, nextMatchId: 'sf2', stage: 'quarterfinal' },
  { id: 'qf4', position: 'QF4', teamAId: null, teamBId: null, teamAScore: null, teamBScore: null, winner: null, nextMatchId: 'sf2', stage: 'quarterfinal' },
  
  { id: 'sf1', position: 'SF1', teamAId: null, teamBId: null, teamAScore: null, teamBScore: null, winner: null, nextMatchId: 'final', stage: 'semifinal' },
  { id: 'sf2', position: 'SF2', teamAId: null, teamBId: null, teamAScore: null, teamBScore: null, winner: null, nextMatchId: 'final', stage: 'semifinal' },
  
  { id: 'final', position: 'F', teamAId: null, teamBId: null, teamAScore: null, teamBScore: null, winner: null, nextMatchId: null, stage: 'final' },
];

type TournamentStore = {
  teams: Team[];
  players: Player[];
  matches: Match[];
  knockoutMatches: KnockoutMatch[];
  standings: Record<string, GroupStanding[]>;
  tournamentName: string;
  organizer: string;
  copyright: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  isSynced: boolean;
  
  addPlayer: (player: Player) => void;
  updatePlayer: (player: Player) => void;
  updateMatch: (match: Match) => void;
  updateKnockoutMatch: (match: KnockoutMatch) => void;
  calculateStandings: () => void;
  setQualifiedTeams: () => void;
  updateTournamentInfo: (name: string, organizer: string, copyright: string) => void;
  updateTeam: (team: Team) => void;
  saveAllData: () => void;
  syncData: () => void;
  setIsAdmin: (isAdmin: boolean) => void;
  
  getTeamById: (id: string) => Team | undefined;
  getPlayersByTeam: (teamId: string) => Player[];
  getTopScorers: (limit?: number) => Player[];
  getCopyrightInfo: () => string;
};

export const useTournamentStore = create<TournamentStore>()(
  persist(
    (set, get) => ({
      teams: initialTeams,
      players: initialPlayers,
      matches: initialMatches,
      knockoutMatches: initialKnockoutMatches,
      standings: {
        A: [] as GroupStanding[],
        B: [] as GroupStanding[],
        C: [] as GroupStanding[],
        D: [] as GroupStanding[],
      },
      tournamentName: 'نرسي 2025',
      organizer: 'لجنة المسابقات',
      copyright: null,
      isLoading: false,
      isAdmin: false,
      isSynced: false,
      
      addPlayer: (player) => {
        set((state) => ({
          players: [...state.players, player]
        }));
        get().saveAllData();
      },
      
      updatePlayer: (updatedPlayer) => {
        set((state) => ({
          players: state.players.map(player => 
            player.id === updatedPlayer.id ? updatedPlayer : player
          )
        }));
        get().saveAllData();
      },
      
      updateMatch: (updatedMatch) => {
        set((state) => ({
          matches: state.matches.map(match => 
            match.id === updatedMatch.id ? updatedMatch : match
          )
        }));
        get().calculateStandings();
        get().saveAllData();
      },
      
      updateKnockoutMatch: (updatedMatch) => {
        set((state) => ({
          knockoutMatches: state.knockoutMatches.map(match => 
            match.id === updatedMatch.id ? updatedMatch : match
          )
        }));
        
        if (updatedMatch.winner && updatedMatch.nextMatchId) {
          const nextMatch = get().knockoutMatches.find(m => m.id === updatedMatch.nextMatchId);
          if (nextMatch) {
            const updatedNextMatch = { ...nextMatch };
            
            if (updatedMatch.position.includes('QF1') || updatedMatch.position.includes('QF2')) {
              updatedNextMatch.teamAId = updatedMatch.winner;
            } else if (updatedMatch.position.includes('QF3') || updatedMatch.position.includes('QF4')) {
              updatedNextMatch.teamBId = updatedMatch.winner;
            } else if (updatedMatch.position.includes('SF1')) {
              updatedNextMatch.teamAId = updatedMatch.winner;
            } else if (updatedMatch.position.includes('SF2')) {
              updatedNextMatch.teamBId = updatedMatch.winner;
            }
            
            set((state) => ({
              knockoutMatches: state.knockoutMatches.map(match => 
                match.id === updatedNextMatch.id ? updatedNextMatch : match
              )
            }));
          }
        }
        
        get().saveAllData();
      },
      
      calculateStandings: () => {
        const { teams, matches } = get();
        const completedMatches = matches.filter(m => m.status === 'completed' && m.stage === 'group');
        
        const newStandings: Record<string, GroupStanding[]> = {
          A: [],
          B: [],
          C: [],
          D: [],
        };
        
        teams.forEach(team => {
          const groupStanding: GroupStanding = {
            teamId: team.id,
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            points: 0,
          };
          
          if (team.group) {
            newStandings[team.group].push(groupStanding);
          }
        });
        
        completedMatches.forEach(match => {
          if (match.homeScore !== null && match.awayScore !== null && match.group) {
            const homeStanding = newStandings[match.group].find(s => s.teamId === match.homeTeamId);
            if (homeStanding) {
              homeStanding.played += 1;
              homeStanding.goalsFor += match.homeScore;
              homeStanding.goalsAgainst += match.awayScore;
              
              if (match.homeScore > match.awayScore) {
                homeStanding.won += 1;
                homeStanding.points += 3;
              } else if (match.homeScore === match.awayScore) {
                homeStanding.drawn += 1;
                homeStanding.points += 1;
              } else {
                homeStanding.lost += 1;
              }
            }
            
            const awayStanding = newStandings[match.group].find(s => s.teamId === match.awayTeamId);
            if (awayStanding) {
              awayStanding.played += 1;
              awayStanding.goalsFor += match.awayScore;
              awayStanding.goalsAgainst += match.homeScore;
              
              if (match.awayScore > match.homeScore) {
                awayStanding.won += 1;
                awayStanding.points += 3;
              } else if (match.awayScore === match.homeScore) {
                awayStanding.drawn += 1;
                awayStanding.points += 1;
              } else {
                awayStanding.lost += 1;
              }
            }
          }
        });
        
        Object.keys(newStandings).forEach(group => {
          newStandings[group].sort((a, b) => {
            if (b.points !== a.points) {
              return b.points - a.points;
            }
            
            const directMatchesA = completedMatches.filter(m => 
              (m.homeTeamId === a.teamId && m.awayTeamId === b.teamId) || 
              (m.homeTeamId === b.teamId && m.awayTeamId === a.teamId)
            );
            
            let aDirectPoints = 0;
            let bDirectPoints = 0;
            
            directMatchesA.forEach(match => {
              if (match.homeTeamId === a.teamId && match.awayTeamId === b.teamId) {
                if (match.homeScore !== null && match.awayScore !== null) {
                  if (match.homeScore > match.awayScore) aDirectPoints += 3;
                  else if (match.homeScore === match.awayScore) {
                    aDirectPoints += 1;
                    bDirectPoints += 1;
                  }
                  else bDirectPoints += 3;
                }
              } else if (match.homeTeamId === b.teamId && match.awayTeamId === a.teamId) {
                if (match.homeScore !== null && match.awayScore !== null) {
                  if (match.homeScore > match.awayScore) bDirectPoints += 3;
                  else if (match.homeScore === match.awayScore) {
                    aDirectPoints += 1;
                    bDirectPoints += 1;
                  }
                  else aDirectPoints += 3;
                }
              }
            });
            
            if (aDirectPoints !== bDirectPoints) {
              return bDirectPoints - aDirectPoints;
            }
            
            const aDiff = a.goalsFor - a.goalsAgainst;
            const bDiff = b.goalsFor - b.goalsAgainst;
            if (bDiff !== aDiff) {
              return bDiff - aDiff;
            }
            
            return b.goalsFor - a.goalsFor;
          });
        });
        
        set({ standings: newStandings });
      },
      
      setQualifiedTeams: () => {
        const { standings, knockoutMatches } = get();
        
        const qfMatches = [...knockoutMatches];
        
        if (
          standings.A.length >= 1 && 
          standings.B.length >= 1 && 
          standings.C.length >= 1 && 
          standings.D.length >= 1
        ) {
          const qf1 = qfMatches.find(m => m.id === 'qf1');
          if (qf1) {
            qf1.teamAId = standings.A[0]?.teamId || null;
            qf1.teamBId = standings.B[1]?.teamId || null;
          }
          
          const qf2 = qfMatches.find(m => m.id === 'qf2');
          if (qf2) {
            qf2.teamAId = standings.B[0]?.teamId || null;
            qf2.teamBId = standings.A[1]?.teamId || null;
          }
          
          const qf3 = qfMatches.find(m => m.id === 'qf3');
          if (qf3) {
            qf3.teamAId = standings.C[0]?.teamId || null;
            qf3.teamBId = standings.D[1]?.teamId || null;
          }
          
          const qf4 = qfMatches.find(m => m.id === 'qf4');
          if (qf4) {
            qf4.teamAId = standings.D[0]?.teamId || null;
            qf4.teamBId = standings.C[1]?.teamId || null;
          }
          
          set({ knockoutMatches: qfMatches });
        }
        
        get().saveAllData();
      },
      
      updateTournamentInfo: (name: string, organizer: string, copyright: string) => {
        set({ tournamentName: name, organizer: organizer, copyright: copyright });
        get().saveAllData();
      },
      
      updateTeam: (updatedTeam: Team) => {
        set((state) => ({
          teams: state.teams.map(team => 
            team.id === updatedTeam.id ? updatedTeam : team
          )
        }));
        get().saveAllData();
      },
      
      saveAllData: () => {
        const state = get();
        if (!state.isAdmin) {
          // إذا لم يكن المستخدم مسؤولاً، فقط احفظ البيانات محليًا
          console.log('حفظ البيانات محليًا فقط، يرجى تسجيل الدخول للمزامنة مع Firebase');
          return;
        }
        
        set((state) => ({ ...state }));
        
        // حفظ البيانات في Firebase
        const dataToSave = {
          teams: state.teams,
          players: state.players,
          matches: state.matches,
          knockoutMatches: state.knockoutMatches,
          tournamentName: state.tournamentName,
          organizer: state.organizer,
          copyright: state.copyright,
          lastUpdated: new Date().toISOString()
        };
        
        set({ isLoading: true });
        
        // حفظ البيانات في Firebase
        set(ref(database, 'tournament'), dataToSave)
          .then(() => {
            set({ isLoading: false, isSynced: true });
            toast.success('تم مزامنة البيانات بنجاح!');
            console.log('تم حفظ البيانات وتحديثها في Firebase', new Date().toISOString());
          })
          .catch((error) => {
            set({ isLoading: false });
            toast.error('فشل في مزامنة البيانات. حاول مرة أخرى.');
            console.error('خطأ في حفظ البيانات:', error);
          });
        
        // تحديث الترتيب دائمًا
        get().calculateStandings();
      },
      
      syncData: () => {
        set({ isLoading: true });
        
        // الاستماع للتغييرات في البيانات من Firebase
        const tournamentRef = ref(database, 'tournament');
        
        // قم بالاستماع مرة واحدة فقط (لا يحتاج إلى استماع مستمر)
        get(tournamentRef)
          .then((snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              
              // تحديث مخزن البيانات بالبيانات من Firebase
              set({
                teams: data.teams || initialTeams,
                players: data.players || initialPlayers,
                matches: data.matches || initialMatches,
                knockoutMatches: data.knockoutMatches || initialKnockoutMatches,
                tournamentName: data.tournamentName || 'نرسي 2025',
                organizer: data.organizer || 'لجنة المسابقات',
                copyright: data.copyright || null,
                isLoading: false,
                isSynced: true
              });
              
              toast.success('تم جلب أحدث البيانات بنجاح!');
              
              // تحديث الترتيب بعد جلب البيانات
              get().calculateStandings();
            } else {
              // إذا لم تكن هناك بيانات، قم بإنشاء البيانات الأولية
              get().saveAllData();
            }
          })
          .catch((error) => {
            set({ isLoading: false });
            toast.error('فشل في مزامنة البيانات. حاول مرة أخرى.');
            console.error('خطأ في جلب البيانات:', error);
          });
      },
      
      setIsAdmin: (isAdmin: boolean) => {
        set({ isAdmin });
        if (isAdmin) {
          get().syncData();
        }
      },
      
      getTeamById: (id) => {
        return get().teams.find(team => team.id === id);
      },
      
      getPlayersByTeam: (teamId) => {
        return get().players.filter(player => player.teamId === teamId);
      },
      
      getTopScorers: (limit = 10) => {
        return [...get().players]
          .sort((a, b) => b.goals - a.goals)
          .slice(0, limit);
      },
      
      getCopyrightInfo: () => {
        return `© جميع الحقوق محفوظة ${new Date().getFullYear()} - ${get().tournamentName} - ${get().organizer}`;
      }
    }),
    {
      name: 'tournament-storage',
      skipHydration: false,
    }
  )
);

// تهيئة الاستماع إلى تغييرات البيانات
const initializeDataListener = () => {
  const tournamentRef = ref(database, 'tournament');
  
  // استمع للتغييرات في البيانات
  onValue(tournamentRef, (snapshot) => {
    if (snapshot.exists()) {
      console.log('تم تحديث البيانات في Firebase، جارٍ التحديث المحلي');
      
      const store = useTournamentStore.getState();
      
      // فقط قم بالتحديث إذا كان المستخدم ليس مسؤولاً (لتجنب دورات التحديث)
      if (!store.isAdmin && !store.isLoading) {
        store.syncData();
      }
    }
  }, (error) => {
    console.error('خطأ في الاستماع للتغييرات:', error);
  });
};

// استدعاء وظيفة التهيئة
try {
  initializeDataListener();
} catch (error) {
  console.error('فشل في تهيئة مستمع البيانات:', error);
}
