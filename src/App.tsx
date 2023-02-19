import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import tw from 'twin.macro';

export function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<div>Welcome</div>} />
                <Route path="/about" element={<div>About</div>} />
            </Routes>
        </Router>
    );
}
