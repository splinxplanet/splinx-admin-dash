import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import CustomerManager from "./scenes/customer";
import EventManager from "./scenes/event";
import EmailNotification from "./scenes/emailnotify";
import AdvertManager from "./scenes/advertisement";
import PromoCodeManager from "./scenes/promo";
import PushNotificationManager from "./scenes/pushnotify";
import SubscriptionManager from "./scenes/subscription";
import SubscriptionPlans from "./scenes/plans";
import WithdrawalRequest from "./scenes/withdrawal";
import Topbar from './scenes/global/Topbar';
import Sidebar from './scenes/global/Sidebar';
import Dashboard from './scenes/dashboard';
import Team from './scenes/team';
import Invoices from './scenes/invoices';
import Form from './scenes/form';
import Pie from './scenes/pie';
import FAQ from './scenes/faq';
import Login from './scenes/login';
import ForgotPassword from './scenes/forgotpassword';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { ColorModeContext, useMode } from './theme';
import OtpVerify from './scenes/otpverify';
import EditEvent from './scenes/event/EditEvent';
import Unauthorized from './components/Unauthorized'; // Add an Unauthorized component

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          {/* Routes definition */}
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify" element={<OtpVerify />} />
            <Route path="/unauthorized" element={<Unauthorized />} /> 

            {/* Protected Routes */}
            <Route path="*" element={
              <ProtectedRoute>
                <>
                  <Sidebar isSidebar={isSidebar} />
                  <main className="content">
                    <Topbar setIsSidebar={setIsSidebar} />
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />

                      {/* Only superadmin can access these routes */}
                      <Route path="/team" element={
                        <ProtectedRoute allowedRoles={['superadmin']}>
                          <Team />
                        </ProtectedRoute>
                      } />
                      <Route path="/customer-manager" element={
                        <ProtectedRoute allowedRoles={['superadmin']}>
                          <CustomerManager />
                        </ProtectedRoute>
                      } />
                      <Route path="/advert-manager" element={
                        <ProtectedRoute allowedRoles={['superadmin']}>
                          <AdvertManager />
                        </ProtectedRoute>
                      } />
                      <Route path="/subscriptions" element={
                        <ProtectedRoute allowedRoles={['superadmin']}>
                          <SubscriptionManager />
                        </ProtectedRoute>
                      } />
                      <Route path="/plans" element={
                        <ProtectedRoute allowedRoles={['superadmin']}>
                          <SubscriptionPlans />
                        </ProtectedRoute>
                      } />

                      {/* Routes accessible by both superadmin and admin */}
                      <Route path="/events" element={<EventManager />} />
                      <Route path="/withdrawal" element={<WithdrawalRequest />} />
                      <Route path="/promo-code" element={<PromoCodeManager />} />
                      <Route path="/push-notification" element={<PushNotificationManager />} />
                      <Route path="/email-notification" element={<EmailNotification />} />
                      <Route path="/invoices" element={<Invoices />} />
                      <Route path="/form" element={<Form />} />
                      <Route path="/pie" element={<Pie />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/event/EditEvent/:eventId" element={<EditEvent />} />
                    </Routes>
                  </main>
                </>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
