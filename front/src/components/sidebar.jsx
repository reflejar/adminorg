'use client'

import { useState } from "react";
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Dropdown
 } from "reactstrap";

import { useAuthContext } from "@/contexts/authContext";
import { configuracionesActions } from "@/redux/actions/configuraciones";

export default function Sidebar() {

    const [isOpen, setIsOpen] = useState(false);
    const { changeCommunity, currentUser } = useAuthContext();
    const dispatch = useDispatch();

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

    const router = useRouter();
    const pathname = usePathname()

    if (!currentUser) return 

    // if mobile make a simple navbar
    if (window.innerWidth < 768) {
        return (<div>
            <nav className="navbar navbar-expand-lg bg-light flex-shrink-0t">
                <div className="container-fluid">
                    <Link href="/" className="navbar-brand link-info text-decoration-none">
                        <Image src={`/img/isoLogo.png`} width={50} height={50} alt="Logo de AdminOrg" className="me-2" /> {currentUser.community}
                    </Link>
                    <UncontrolledDropdown  inNavbar className="pr-1" direction="left">
                        <DropdownToggle nav className="d-flex align-items-center dropdown-toggle">
                            <img src={`/img/assistant.svg`} alt="" width="32" height="32" className="me-3" />
                        </DropdownToggle>


                        <DropdownMenu>
                            <DropdownItem disabled>
                                <span className="text-dark">
                                {currentUser.profile.nombre} <span className="text-muted">({currentUser.user.group})</span>
                                </span>
                            </DropdownItem>
                            <DropdownItem divider />

                            {/* <Link to="/user-profile" className="p-0"> */}
                            <DropdownItem>
                                <i className="bi-person"></i> Ver Perfil
                            </DropdownItem>
                            {/* </Link> */}
                            {currentUser.admin_of.length > 0 && <select
                                name="comunidad"
                                id="comunidad"
                                className="form-select my-2"
                                onChange={(option) => changeCommunity(option.value)}
                                value={currentUser.community}
                                >
                                    {currentUser.admin_of.map((c, k) => (<option key={k} value={c}>{c}</option>))}
                                </select>}
                            
                            {/* <Link disabled to="/faq" className="p-0"> */}
                            <DropdownItem disabled>
                                <i className="bi-info-circle"></i> Ayuda
                            </DropdownItem>
                            {/* </Link> */}
                            <DropdownItem divider />
                            <DropdownItem>
                                <div onClick={() => router.push('/auth/logout')} >
                                    <i className="bi-box-arrow-right"></i> Logout
                                </div>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>                    
                </div>
            </nav>
            <Dropdown isOpen={isOpen} toggle={handleClick} className="m-2" direction="down">
                <DropdownToggle
                    color="primary"
                    className="shadow-sm dropdown-toggle"
                    block
                >
                    {pathname === '/resumen' && <span><i className="bi-bar-chart-line" /> Inicio</span>}
                    {pathname === '/cuentas-a-cobrar' && <span><i className="bi-download" /> Cuentas a cobrar</span>}
                    {pathname === '/cuentas-a-pagar' && <span><i className="bi-upload" /> Cuentas a pagar</span>}
                    {pathname === '/tesoreria' && <span><i className="bi-currency-dollar" /> Gestión de Fondos</span>}
                    {pathname === '/contabilidad' && currentUser.user.group === "contable" && <span><i className="bi-briefcase" /> Contabilidad</span>}
                    {pathname === '/configuraciones' && <span><i className="bi-house-gear-fill" /> Mi Organización</span>}
                </DropdownToggle>
                <DropdownMenu >
                    <Link href="/resumen" className={`nav-link ${pathname == '/resumen' ? 'active' : 'link-info'}`}><i className="bi-bar-chart-line me-2" /> Inicio</Link>
                    <Link href="/cuentas-a-cobrar" className={`nav-link ${pathname == '/cuentas-a-cobrar' ? 'active' : 'link-info'}`}> <i className="bi-download me-2" /> Cuentas a cobrar</Link>
                    <Link href="/cuentas-a-pagar" className={`nav-link ${pathname == '/cuentas-a-pagar' ? 'active' : 'link-info'}`}><i className="bi-upload me-2" /> Cuentas a pagar</Link>
                    <Link href="/tesoreria" className={`nav-link ${pathname == '/tesoreria' ? 'active' : 'link-info'}`}><i className="bi-currency-dollar me-2" /> Gestión de Fondos</Link>
                    {currentUser.user.group === "contable" && <Link href="/contabilidad" className={`nav-link ${pathname == '/contabilidad' ? 'active' : 'link-info'}`}><i className="bi-briefcase me-2" /> Contabilidad</Link>}
                    <Link href="/configuraciones" className={`nav-link ${pathname == '/configuraciones' ? 'active' : 'link-info'}`}><i className="bi-house-gear-fill me-2" /> Mi Organización</Link>        

                </DropdownMenu>
            </Dropdown>           
        </div>
        )
    }

    return (<div className="col-lg-2 d-flex flex-column flex-shrink-0 p-3 bg-light min-vh-100">
                    <Link href="/" className="d-flex align-items-center mb-md-0 me-md-auto link-info text-decoration-none">
                        <span className="fs-5">
                            <Image src={`/img/isoLogo.png`} width={50} height={50} alt="Logo de AdminOrg" className="me-2" /> {currentUser.community}
                        </span>
                    </Link> 
                    <hr />
                    <ul className="nav nav-pills flex-column mb-auto">
                        <Link href="/resumen" className={`nav-link ${pathname == '/resumen' ? 'active' : 'link-info'}`}><i className="bi-bar-chart-line me-2" /> Inicio</Link>
                        <Link href="/cuentas-a-cobrar" className={`nav-link ${pathname == '/cuentas-a-cobrar' ? 'active' : 'link-info'}`}> <i className="bi-download me-2" /> Cuentas a cobrar</Link>
                        <Link href="/cuentas-a-pagar" className={`nav-link ${pathname == '/cuentas-a-pagar' ? 'active' : 'link-info'}`}><i className="bi-upload me-2" /> Cuentas a pagar</Link>
                        <Link href="/tesoreria" className={`nav-link ${pathname == '/tesoreria' ? 'active' : 'link-info'}`}><i className="bi-currency-dollar me-2" /> Gestión de Fondos</Link>
                        {currentUser.user.group === "contable" && <Link href="/contabilidad" className={`nav-link ${pathname == '/contabilidad' ? 'active' : 'link-info'}`}><i className="bi-briefcase me-2" /> Contabilidad</Link>}
                        <Link href="/configuraciones" className={`nav-link ${pathname == '/configuraciones' ? 'active' : 'link-info'}`}><i className="bi-house-gear-fill me-2" /> Mi Organización</Link>
                    </ul>
                    <hr />

                    <UncontrolledDropdown inNavbar className="pr-1" direction="up">
                        <DropdownToggle nav className="d-flex align-items-center link-info text-decoration-none dropdown-toggle">
                            <img src={`/img/assistant.svg`} alt="" width="32" height="32" className="rounded-circle me-2" />
                            <strong>{currentUser.profile && currentUser.profile.nombre}</strong>
                        </DropdownToggle>


                        <DropdownMenu>
                            <DropdownItem disabled>
                                <span className="text-dark">
                                {currentUser.profile.nombre}
                                </span>
                            </DropdownItem>
                            <DropdownItem divider />

                            {/* <Link to="/user-profile" className="p-0"> */}
                            <DropdownItem>
                                <div onClick={() => {
                                    dispatch(configuracionesActions.select({id: "perfil", icon: "bi-caret-right", full_name: "Datos del Perfil"},))
                                    router.push('/configuraciones')
                                }} >
                                <i className="bi-person"></i> Ver Perfil
                                </div>                                
                            </DropdownItem>
                            {/* </Link> */}
                            {currentUser.admin_of.length > 0 && <select
                                name="comunidad"
                                id="comunidad"
                                className="form-select my-2"
                                onChange={(option) => changeCommunity(option.value)}
                                value={currentUser.community}
                                >
                                    {currentUser.admin_of.map((c, k) => (<option key={k} value={c}>{c}</option>))}
                                </select>}
                            
                            {/* <Link disabled to="/faq" className="p-0"> */}
                            <DropdownItem disabled>
                                <i className="bi-info-circle"></i> Ayuda 
                            </DropdownItem>
                            {/* </Link> */}
                            <DropdownItem divider />
                            <DropdownItem>
                                <div onClick={() => router.push('/auth/logout')} >
                                    <i className="bi-box-arrow-right"></i> Logout
                                </div>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
    </div>
    )
  }
  

