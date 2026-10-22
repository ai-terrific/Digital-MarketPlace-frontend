import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { Dialog, DialogTitle } from "@mui/material";
import type { DialogProps } from "@mui/material";

interface DialogConfig {
  title: ReactNode;
  content: ReactNode;
  maxWidth?: DialogProps["maxWidth"];
  fullWidth?: boolean;
}

interface DialogContextValue {
  openDialog: (config: DialogConfig) => void;
  closeDialog: () => void;
  setDialogCloseDisabled: (disabled: boolean) => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

export const DialogProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [dialog, setDialog] = useState<DialogConfig | null>(null);
  const [closeDisabled, setCloseDisabled] = useState(false);

  const openDialog = useCallback((config: DialogConfig) => {
    setCloseDisabled(false);
    setDialog(config);
  }, []);

  const closeDialog = useCallback(() => {
    setDialog(null);
  }, []);

  const handleDialogClose = useCallback(() => {
    if (!closeDisabled) closeDialog();
  }, [closeDisabled, closeDialog]);

  const value = useMemo(
    () => ({
      openDialog,
      closeDialog,
      setDialogCloseDisabled: setCloseDisabled,
    }),
    [openDialog, closeDialog],
  );

  return (
    <DialogContext.Provider value={value}>
      {children}
      <Dialog
        open={Boolean(dialog)}
        onClose={handleDialogClose}
        maxWidth={dialog?.maxWidth ?? "sm"}
        fullWidth={dialog?.fullWidth ?? true}
      >
        {dialog && (
          <>
            <DialogTitle>{dialog.title}</DialogTitle>
            {dialog.content}
          </>
        )}
      </Dialog>
    </DialogContext.Provider>
  );
};

export const useDialog = (): DialogContextValue => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider.");
  }

  return context;
};
