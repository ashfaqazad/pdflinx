"use client";

import * as React from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";

// ✅ Pages
const pages = [
  { name: "Home", path: "/" },
  { name: "PDF to Word", path: "/pdf-to-word" },
  { name: "Word to PDF", path: "/word-to-pdf" },
    { name: "Image to PDF", path: "/image-to-pdf" },
  { name: "Merge PDF", path: "/merge-pdf" },
    { name: "Split PDF", path: "/split-pdf" },
  { name: "Compress PDF", path: "/compress-pdf" },
  { name: "Excel PDF", path: "/excel-pdf" },

  { name: "Blog", path: "/blog" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };

  return (
    <AppBar position="static" style={{ backgroundColor: "black" }}>
      <Container maxWidth="xl">
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          {/* ✅ Left Side Brand */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            href="/"
            style={{
              fontWeight: "bold",
              letterSpacing: "1px",
              color: "white",
              textDecoration: "none",
            }}
          >
            PDF Tools
          </Typography>

          {/* ✅ Desktop Menu */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: "10px" }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={Link}
                href={page.path}
                style={{
                  my: 2,
                  color: "white",
                  textTransform: "none",
                  padding: "6px 12px",
                  fontFamily: "unset",
                  fontSize: "14px",
                }}
              >
                <span className="nav-item-span">{page.name}</span>
              </Button>
            ))}
          </Box>

          {/* ✅ Mobile Hamburger */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              onClick={toggleDrawer(true)}
              style={{ color: "white" }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* ✅ Drawer (Top) */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          style: { backgroundColor: "black", color: "white", width:200 },
        }}
      >
        <List>
          {pages.map((page) => (
            <ListItem
              button
              key={page.name}
              component={Link}
              href={page.path}
              onClick={toggleDrawer(false)}
              style={{ textAlign: "left" }}
            >
              <ListItemText primary={page.name} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
}















// "use client";

// import * as React from "react";
// import Link from "next/link";
// import AppBar from "@mui/material/AppBar";
// import Box from "@mui/material/Box";
// import Toolbar from "@mui/material/Toolbar";
// import IconButton from "@mui/material/IconButton";
// import Typography from "@mui/material/Typography";
// import Menu from "@mui/material/Menu";
// import MenuIcon from "@mui/icons-material/Menu";
// import Container from "@mui/material/Container";
// import Button from "@mui/material/Button";
// import MenuItem from "@mui/material/MenuItem";

// // ✅ Pages
// const pages = [
//   { name: "Home", path: "/" },
//   { name: "PDF to Word", path: "/pdf-to-word" },
//   { name: "Word to PDF", path: "/word-to-pdf" },
//   { name: "Merge PDF", path: "/merge-pdf" },
//   { name: "Compress PDF", path: "/compress-pdf" },
//   { name: "Blog", path: "/blog" },
//   { name: "About", path: "/about" },
//   { name: "Contact", path: "/contact" },
// ];

// export default function Navbar() {
//   const [anchorElNav, setAnchorElNav] = React.useState(null);

//   const handleOpenNavMenu = (event) => {
//     setAnchorElNav(event.currentTarget);
//   };
//   const handleCloseNavMenu = () => {
//     setAnchorElNav(null);
//   };

//   return (
//     <AppBar position="static" style={{ backgroundColor: "black" }}>
//       <Container maxWidth="xl">
//         <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
//           {/* ✅ Left Side Brand */}
//           <Typography
//             variant="h6"
//             noWrap
//             component={Link}
//             href="/"
//             style={{
//               fontWeight: "bold",
//               letterSpacing: "1px",
//               color: "white",
//               textDecoration: "none",
//             }}
//           >
//             PDF Tools
//           </Typography>

//           {/* ✅ Right Side Nav Items (Desktop) */}


//           <Box style={{ display: "flex", gap: "10px" }}>
//             {pages.map((page) => (
//               <Link key={page.name} href={page.path} passHref legacyBehavior>


//                 <Button
//                   key={page.name}
//                   component={Link}
//                   href={page.path}
//                   onClick={handleCloseNavMenu}
//                   style={{
//                     my: 2,
//                     color: "white",
//                     textTransform: "none",
//                     padding: "6px 12px",
//                     fontFamily: "unset",
//                     fontSize: "18px",
//                   }}
//                 >
//                   <span className="nav-item-span">{page.name}</span>
//                 </Button>

//               </Link>
//             ))}
//           </Box>


//           {/* ✅ Mobile Menu */}
//           <Box style={{ display: "none" }}>
//             <IconButton
//               size="large"
//               aria-label="menu"
//               onClick={handleOpenNavMenu}
//               style={{ color: "white" }}
//             >
//               <MenuIcon />
//             </IconButton>

//             <Menu
//               anchorEl={anchorElNav}
//               anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
//               keepMounted
//               transformOrigin={{ vertical: "top", horizontal: "left" }}
//               open={Boolean(anchorElNav)}
//               onClose={handleCloseNavMenu}
//             >
//               {pages.map((page) => (
//                 <MenuItem
//                   key={page.name}
//                   onClick={handleCloseNavMenu}
//                   component={Link}
//                   href={page.path}
//                 >
//                   {page.name}
//                 </MenuItem>
//               ))}
//             </Menu>
//           </Box>
//         </Toolbar>
//       </Container>
//     </AppBar>
//   );
// }
