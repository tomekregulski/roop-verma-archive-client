import { ReactNode, createContext, useContext, useMemo, useState } from 'react';

interface RegistrationInfo {
    firstName: string;
    lastName: string;
    email: string;
    // stripeId: string;
}

interface RegistrationState {
    registrationInfo: RegistrationInfo;
    updateRegistrationInfo: (data: Partial<RegistrationInfo>) => void;
}

interface RegistrationContextProps {
    children: ReactNode;
}

export const OUTSIDE_REGISTRATION_PROVIDER_ERROR =
    'Attempting to access RegistrationContext outside of Provider!';

export const RegistrationContext = createContext<RegistrationState | null>(
    null
);

export function RegistrationProvider(props: RegistrationContextProps) {
    const [registrationInfo, setRegistrationInfo] = useState<RegistrationInfo>({
        firstName: '',
        lastName: '',
        email: '',
        // stripeId: '',
    });

    const { children } = props;

    const updateRegistrationInfo = (data: Partial<RegistrationInfo>) => {
        // const newData = { ...registrationInfo, ...data };
        // setRegistrationInfo(newData);
        setRegistrationInfo((prevState) => ({
            ...prevState,
            ...data,
        }));
    };

    const value = useMemo(
        () => ({
            registrationInfo,
            updateRegistrationInfo,
        }),
        [registrationInfo]
    );

    return (
        <RegistrationContext.Provider value={value}>
            {children}
        </RegistrationContext.Provider>
    );
}

export const useRegistrationContext = () => {
    const registrationContext = useContext(RegistrationContext);

    if (!registrationContext) {
        throw new Error(OUTSIDE_REGISTRATION_PROVIDER_ERROR);
    }

    return registrationContext;
};
