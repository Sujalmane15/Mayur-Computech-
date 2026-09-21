/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter } from 'react-router-dom';
import { AdminRouter } from './admin/App';

export default function App() {
  return (
    <BrowserRouter>
      <AdminRouter />
    </BrowserRouter>
  );
}
