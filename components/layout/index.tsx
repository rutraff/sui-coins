import { Box, Typography } from '@interest-protocol/ui-kit';
import { FC, PropsWithChildren } from 'react';

import { ModalProvider } from '@/context/modal';
import Web3Manager from '@/context/web3-manager';

import Footer from './footer';
import Header from './header';
import { LayoutProps } from './layout.types';
import Sidebar from './sidebar';

const Layout: FC<PropsWithChildren<LayoutProps>> = ({ title, children }) => (
  <Box display="flex" height="100vh" overflow="hidden" bg="surface">
    <Sidebar />
    <Box as="aside" position="relative" flex="1">
      <Header />
      <Web3Manager>
        <ModalProvider>
          <Box width="100%" overflowY="auto">
            <Box
              m="0"
              width="100%"
              display="flex"
              maxHeight="100vh"
              variant="container"
              flexDirection="column"
              px={['m', 'l', 'l', 'xl']}
              mt="unset"
            >
              <Box as="main" flex="1" mb="10xl">
                <Box>
                  {title && (
                    <Typography
                      textAlign="center"
                      variant="display"
                      size="medium"
                      my="3rem"
                    >
                      {title}
                    </Typography>
                  )}
                  {children}
                </Box>
              </Box>
              <Footer />
            </Box>
          </Box>
        </ModalProvider>
      </Web3Manager>
    </Box>
  </Box>
);

export default Layout;
