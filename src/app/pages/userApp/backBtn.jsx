import React from 'react';
import { useMediaQuery } from '@mui/material'
import { Link } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BackLink = () => {
  // const history = useHistory();

  const handleBackClick = () => {
    // history.goBack(); // This will navigate back in the browser history
    window.history.back(); // This will navigate back in the browser history
  };

  const mob = useMediaQuery("(max-width:800px)");
  return (
    <Link
      className="secondary"
      style={{
        marginBottom: '0px',
        display: 'flex',
        cursor: 'pointer',
        zIndex: "1000",
        alignItems: 'center',
        color: '#3D3D3D',
        fontSize: '14px',
        textDecoration: 'none',
        paddingLeft: "24px"
      }}
      onClick={handleBackClick}
    >
      {mob ? (<ArrowBackIcon style={{ marginRight: '0px', fontSize: '22px' }} />) : (<><ArrowBackIosIcon style={{ marginRight: '4px', fontSize: '12px' }} /> Back</>)}
    </Link>
  );
};

export default BackLink;
