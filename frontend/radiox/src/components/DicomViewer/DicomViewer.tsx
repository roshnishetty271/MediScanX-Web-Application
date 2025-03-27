import React, { useState } from 'react';
import { Box, Typography, Button, Tooltip, IconButton, Slider, Paper, CircularProgress } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import PanToolIcon from '@mui/icons-material/PanTool';
import ContrastIcon from '@mui/icons-material/Contrast';
import UndoIcon from '@mui/icons-material/Undo';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import CollectionsIcon from '@mui/icons-material/Collections';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RestoreIcon from '@mui/icons-material/Restore';
import './DicomViewer.css';

// Sample DICOM image for demonstration
const SAMPLE_DICOM_IMAGE = 'https://www.researchgate.net/profile/Saad-Dahmani/publication/329771772/figure/fig4/AS:705181092638720@1545148701308/Chest-X-ray-image-from-the-JSRT-database-used-for-our-segmentation-application.jpg';

interface DicomViewerProps {
  imageUrl: string;
  patientId: string;
  reportType: string;
}

const DicomViewer: React.FC<DicomViewerProps> = ({ imageUrl, patientId, reportType }) => {
  // State variables
  const [loading, setLoading] = useState(false);
  const [brightness, setBrightness] = useState(50);
  const [contrast, setContrast] = useState(50);
  const [showControls, setShowControls] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [selectedTool, setSelectedTool] = useState<string>('pan');
  const [error, setError] = useState<string | null>(null);
  
  // Calculate CSS filters based on brightness and contrast
  const getImageStyle = () => {
    const brightnessValue = brightness * 2 / 100;
    const contrastValue = contrast * 2 / 100;
    return {
      filter: `brightness(${brightnessValue}) contrast(${contrastValue})`,
      transform: `scale(${zoom / 100})`,
      maxWidth: '100%',
      maxHeight: '100%',
      transition: 'transform 0.2s'
    };
  };

  // Handle tool change
  const handleToolChange = (tool: string) => {
    setSelectedTool(tool);
  };

  // Handle reset
  const handleReset = () => {
    setBrightness(50);
    setContrast(50);
    setZoom(100);
  };

  // Handle brightness change
  const handleBrightnessChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setBrightness(newValue);
    }
  };

  // Handle contrast change
  const handleContrastChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') {
      setContrast(newValue);
    }
  };

  // Handle zoom
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  // Use the provided image URL or fallback to sample image
  const displayImage = imageUrl && imageUrl.includes('data:') ? imageUrl : SAMPLE_DICOM_IMAGE;

  return (
    <Box className="dicom-viewer-container">
      {/* Header */}
      <Paper sx={{ p: 1, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1" fontWeight="bold">
          {reportType} - Patient ID: {patientId}
        </Typography>
        <Button 
          size="small" 
          onClick={() => setShowControls(!showControls)}
          startIcon={showControls ? <CloseIcon /> : <CollectionsIcon />}
        >
          {showControls ? 'Hide Controls' : 'Show Controls'}
        </Button>
      </Paper>

      {/* Controls */}
      {showControls && (
        <Paper sx={{ p: 1, mb: 1 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Pan & Zoom">
              <IconButton 
                color={selectedTool === 'pan' ? 'primary' : 'default'} 
                onClick={() => handleToolChange('pan')}
              >
                <PanToolIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Window/Level">
              <IconButton 
                color={selectedTool === 'window' ? 'primary' : 'default'} 
                onClick={() => handleToolChange('window')}
              >
                <ContrastIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Zoom In">
              <IconButton onClick={handleZoomIn}>
                <ZoomInIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Zoom Out">
              <IconButton onClick={handleZoomOut}>
                <ZoomOutIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Reset View">
              <IconButton onClick={handleReset}>
                <RestoreIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Brightness">
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, width: '150px' }}>
                <RemoveIcon fontSize="small" />
                <Slider
                  value={brightness}
                  onChange={handleBrightnessChange}
                  min={0}
                  max={100}
                  sx={{ mx: 1 }}
                />
                <AddIcon fontSize="small" />
              </Box>
            </Tooltip>
            
            <Tooltip title="Contrast">
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2, width: '150px' }}>
                <RemoveIcon fontSize="small" />
                <Slider
                  value={contrast}
                  onChange={handleContrastChange}
                  min={0}
                  max={100}
                  sx={{ mx: 1 }}
                />
                <AddIcon fontSize="small" />
              </Box>
            </Tooltip>
            
            <Button 
              variant="contained" 
              startIcon={<SaveIcon />}
              size="small"
              sx={{ ml: 'auto' }}
            >
              Save Image
            </Button>
          </Box>
        </Paper>
      )}

      {/* Image Viewer */}
      <Box 
        className="dicom-image-container" 
        sx={{ 
          position: 'relative',
          height: showControls ? 'calc(100% - 130px)' : 'calc(100% - 60px)',
          border: '1px solid #ddd',
          borderRadius: 1,
          overflow: 'hidden',
          bgcolor: '#000',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: selectedTool === 'pan' ? 'grab' : 'default'
        }}
      >
        {loading && (
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexDirection: 'column',
              zIndex: 10,
              bgcolor: 'rgba(0,0,0,0.7)'
            }}
          >
            <CircularProgress color="primary" />
            <Typography variant="body2" color="white" sx={{ mt: 2 }}>
              Loading DICOM Image...
            </Typography>
          </Box>
        )}

        {error ? (
          <Box 
            sx={{ 
              position: 'absolute', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexDirection: 'column',
              zIndex: 10,
              bgcolor: 'rgba(0,0,0,0.7)',
              color: 'white',
              p: 3,
              textAlign: 'center'
            }}
          >
            <InfoIcon color="error" sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="body1" gutterBottom>
              {error}
            </Typography>
            <Typography variant="body2">
              Using sample DICOM data for demonstration
            </Typography>
          </Box>
        ) : (
          <Box 
            sx={{ 
              overflow: 'hidden', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              width: '100%',
              height: '100%'
            }}
          >
            <img 
              src={displayImage} 
              alt={`${reportType} for Patient ${patientId}`}
              onError={() => setError('Failed to load image. Using sample data.')}
              style={getImageStyle()}
            />
            <div className="dicom-overlay">
              <div className="dicom-info">
                <div>P: {patientId}</div>
                <div>Type: {reportType}</div>
                <div>W: {contrast * 2}</div>
                <div>L: {brightness - 50}</div>
                <div>Z: {zoom}%</div>
              </div>
            </div>
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Paper sx={{ p: 1, mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          Zoom: {zoom}% | Brightness: {brightness} | Contrast: {contrast}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          RadioX DICOM Viewer v1.0 (Demo)
        </Typography>
      </Paper>
    </Box>
  );
};

export default DicomViewer; 