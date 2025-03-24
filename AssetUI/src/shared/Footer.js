const config = require('../services/config.json');
 function Footer() {
    return (
        <>
            <footer className="main-footer ">
                <strong> &copy; 2024-2025 <a href="https://www.iteos.in/">{config.PoweredBy}</a>.</strong>
                All rights reserved.
                <div className="float-right d-none d-sm-inline-block">
                    <b>Version</b> {config.version}
                </div>
            </footer>
        </>
    );
}

export default Footer;