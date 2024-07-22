'use client'

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation";
import {
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
 } from "reactstrap";

import { useAuthContext } from "@/contexts/authContext";

export default function Sidebar() {

    const { changeCommunity, currentUser } = useAuthContext();
    const router = useRouter();
    const pathname = usePathname()

    if (!currentUser) return 

    return (<div className="col-lg-2 d-flex flex-column flex-shrink-0 p-3 bg-light min-vh-100">
                    <Link href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
                        <span className="fs-4">{currentUser.logo ? <img src={currentUser.logo} alt={currentUser.community} height={50} /> : currentUser.community}</span>
                    </Link> 
                    <hr />
                    <ul className="nav nav-pills flex-column mb-auto">
                        <Link href="/reportes" className={`nav-link ${pathname == '/reportes' ? 'active' : 'link-dark'}`}><i className="bi-bar-chart-line me-2" /> Resumen</Link>
                        <Link href="/cuentas-a-cobrar" className={`nav-link ${pathname == '/cuentas-a-cobrar' ? 'active' : 'link-dark'}`}> <i className="bi-download me-2" /> Cuentas a cobrar</Link>
                        <Link href="/cuentas-a-pagar" className={`nav-link ${pathname == '/cuentas-a-pagar' ? 'active' : 'link-dark'}`}><i className="bi-upload me-2" /> Cuentas a pagar</Link>
                        <Link href="/tesoreria" className={`nav-link ${pathname == '/tesoreria' ? 'active' : 'link-dark'}`}><i className="bi-currency-dollar me-2" /> Tesorería</Link>
                        {currentUser.user.group === "contable" && <Link href="/contabilidad" className={`nav-link ${pathname == '/contabilidad' ? 'active' : 'link-dark'}`}><i className="bi-briefcase me-2" /> Contabilidad</Link>}
                        <Link href="/configuraciones" className={`nav-link ${pathname == '/configuraciones' ? 'active' : 'link-dark'}`}><i className="bi-house-gear-fill me-2" /> Mi Organización</Link>
                    </ul>
                    <hr />

                    <UncontrolledDropdown nav inNavbar className="pr-1" direction="up">
                        <DropdownToggle nav className="d-flex align-items-center link-dark text-decoration-none dropdown-toggle">
                            <img src="/img/assistant.svg" alt="" width="32" height="32" className="rounded-circle me-2" />
                            <strong>{currentUser.profile && currentUser.profile.nombre}</strong>
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
                                <i className="bi-bookmark"></i> Biblioteca y FAQ
                            </DropdownItem>
                            {/* </Link> */}
                            <DropdownItem divider />
                            <DropdownItem>
                                <div onClick={() => router.push('/auth/logout')} >
                                    <i className="bi-logout"></i> Logout
                                </div>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>



    </div>
    )
  }
  

