const palette = {
  bg: '#0B0F19',
  card: '#161B22',
  primary: '#C1A461',
  primaryHover: '#D1B471',
  text: '#E6EDF3',
  secondary: '#30363D',
  accent: '#8B949E',
};

export const styles = {
  appContainer: {
    fontFamily: "'Inter', sans-serif",
    backgroundColor: palette.bg,
    minHeight: '100vh',
    color: palette.text,
    paddingBottom: '50px',
    margin: 0,
    overflowX: 'hidden',
  },
  header: {
    padding: '20px 60px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(22, 27, 34, 0.9)',
    backdropFilter: 'blur(10px)',
    borderBottom: `1px solid ${palette.secondary}`,
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  logoContainer: { display: 'flex', flexDirection: 'column' },
  logoText: { fontSize: '1.8rem', fontWeight: '900', color: palette.primary, margin: 0, letterSpacing: '2px' },
  logoSub: { fontSize: '0.6rem', color: palette.text, letterSpacing: '4px', textTransform: 'uppercase', borderTop: `1px solid ${palette.primary}`, paddingTop: '2px' },
  
  toggleFormBtn: {
    padding: '10px 20px',
    backgroundColor: 'transparent',
    color: palette.primary,
    border: `1px solid ${palette.primary}`,
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: '0.3s ease',
  },
  
  heroSection: {
    textAlign: 'center',
    padding: '100px 20px 40px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: '5rem',
    fontWeight: '900',
    margin: 0,
    color: palette.primary,
    letterSpacing: '-3px',
    textTransform: 'uppercase',
  },
  heroSubtitle: {
    fontSize: '1.1rem',
    color: palette.accent,
    marginTop: '15px',
    fontWeight: '300',
    letterSpacing: '2px',
    maxWidth: '600px',
  },
  divider: {
    width: '40px',
    height: '2px',
    backgroundColor: palette.primary,
    marginTop: '30px',
  },
  
  formCard: {
    maxWidth: '700px',
    margin: '0 auto 50px auto',
    backgroundColor: palette.card,
    padding: '40px',
    borderRadius: '12px',
    border: `1px solid ${palette.secondary}`,
    boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
  },

  filterContainer: {
    marginTop: '25px',
    paddingTop: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '15px',
    color: palette.accent,
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },

  filterSelect: {
    backgroundColor: palette.bg,
    color: palette.primary,
    border: `1px solid ${palette.secondary}`,
    padding: '8px 15px',
    borderRadius: '4px',
    outline: 'none',
    cursor: 'pointer',
  },

  input: {
    padding: '14px',
    marginBottom: '15px',
    width: '100%',
    borderRadius: '4px',
    border: `1px solid ${palette.secondary}`,
    backgroundColor: palette.bg,
    color: palette.text,
    boxSizing: 'border-box',
    fontSize: '14px',
  },
  
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  
  card: {
    backgroundColor: palette.card,
    padding: '30px',
    borderRadius: '12px',
    border: `1px solid ${palette.secondary}`,
    transition: '0.3s ease',
    cursor: 'pointer',
  },

  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: palette.primary,
    color: palette.bg,
    border: 'none',
    borderRadius: '6px',
    fontWeight: '800',
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginTop: '10px',
    transition: 'all 0.3s ease',
  },
  
  buttonHover: {
    backgroundColor: palette.primaryHover,
    boxShadow: `0 0 20px ${palette.primary}44`,
    transform: 'translateY(-2px)',
  },

  statusBadge: (status) => ({
    padding: '5px 12px',
    borderRadius: '3px',
    fontSize: '10px',
    fontWeight: '900',
    backgroundColor: status === 'lost' ? '#442D30' : '#233B33',
    color: status === 'lost' ? '#FF6B6B' : '#7EE787',
    textTransform: 'uppercase',
    marginBottom: '20px',
    display: 'inline-block',
  }),

  timestampText: {
    fontSize: '0.75rem',
    color: palette.accent,
    opacity: 0.6,
    marginTop: '25px',
    textAlign: 'right',
    fontStyle: 'italic',
    display: 'block',
    borderTop: `1px solid ${palette.secondary}`,
    paddingTop: '10px',
  },

  modalOverlay: { 
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
    backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', 
    justifyContent: 'center', alignItems: 'center', zIndex: 2000, 
    backdropFilter: 'blur(10px)' 
  },
  modalContent: { 
    backgroundColor: palette.card, padding: '50px', borderRadius: '16px', 
    maxWidth: '550px', width: '95%', border: `1px solid ${palette.primary}33` 
  }
};