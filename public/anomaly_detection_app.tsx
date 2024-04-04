/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

import { CoreStart, AppMountParameters } from '../../../src/core/public';
import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route } from 'react-router-dom';
import { Main } from './pages/main';
import { Provider } from 'react-redux';
import configureStore from './redux/configureStore';
import { CoreServicesContext } from './components/CoreServices/CoreServices';
import { DataSourceManagementPluginSetup } from '../../../src/plugins/data_source_management/public';
import { DataSourcePluginSetup } from '../../../src/plugins/data_source/public';

export function renderApp(
  coreStart: CoreStart,
  params: AppMountParameters,
  dataSourceManagement: DataSourceManagementPluginSetup,
  dataSource: DataSourcePluginSetup
) {
  const http = coreStart.http;
  const store = configureStore(http);

  // Load Chart's dark mode CSS (if applicable)
  const isDarkMode = coreStart.uiSettings.get('theme:darkMode') || false;
  if (isDarkMode) {
    require('@elastic/charts/dist/theme_only_dark.css');
  } else {
    require('@elastic/charts/dist/theme_only_light.css');
  }

  ReactDOM.render(
    <Provider store={store}>
      <Router>
        <Route
          render={(props) => (
            <CoreServicesContext.Provider value={coreStart}>
              <Main
                dataSourceEnabled={dataSource.dataSourceEnabled}
                dataSourceManagement={dataSourceManagement}
                setHeaderActionMenu={params.setHeaderActionMenu}
                {...props}
              />
            </CoreServicesContext.Provider>
          )}
        />
      </Router>
    </Provider>,
    params.element
  );
  return () => ReactDOM.unmountComponentAtNode(params.element);
}
