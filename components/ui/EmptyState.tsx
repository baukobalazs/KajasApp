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
            <InboxIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} aria-hidden="true" />
            <Typography variant="h6" fontWeight={600} gutterBottom>
                {message}
            </Typography>
            {subMessage && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {subMessage}
                </Typography>
            )}
            {onAction && actionLabel && (
                <Button variant="outlined" onClick={onAction} sx={{ minHeight: 44 }}>
                    {actionLabel}
                </Button>
            )}
        </Box>
    );
}