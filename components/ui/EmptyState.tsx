import { Box, Typography, Button } from '@mui/material';
import InboxIcon from '@mui/icons-material/Inbox';

interface EmptyStateProps {
    message: string;
    subMessage?: string;
    onAction?: () => void;
    actionLabel?: string;
}

export default function EmptyState({
    message,
    subMessage,
    onAction,
    actionLabel,
}: EmptyStateProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                color: 'text.secondary',
                textAlign: 'center',
            }}
            role="status"
            aria-live="polite"
        >
            <Box
                sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    bgcolor: 'rgba(0,0,0,0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2.5,
                }}
            >
                <InboxIcon sx={{ fontSize: 40, opacity: 0.35 }} aria-hidden="true" />
            </Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
                {message}
            </Typography>
            {subMessage && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, maxWidth: 360 }}>
                    {subMessage}
                </Typography>
            )}
            {onAction && actionLabel && (
                <Button variant="outlined" onClick={onAction} sx={{ minHeight: 44, mt: 1 }}>
                    {actionLabel}
                </Button>
            )}
        </Box>
    );
}