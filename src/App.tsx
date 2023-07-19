import React, { useEffect, useRef, useState } from 'react'
import { type User, type RandomUserResponse } from './types'

function App (): React.JSX.Element {
  const [usersResponse, setUsersResponse] = useState<User[]>([])
  const [colorColumns, setColorColumns] = useState<boolean>(false)
  const [sortBycountry, setSortBycountry] = useState<boolean>(false)
  const originalUsers = useRef<User[]>([])
  useEffect(() => {
    async function getUsers (): Promise<void> {
      if (usersResponse.length !== 0) return
      const response = await fetch('https://randomuser.me/api/?results=100')
      const data: RandomUserResponse = await response.json() as RandomUserResponse
      originalUsers.current = data.results
      setUsersResponse(data.results)
    }
    void getUsers()
  }, [])

  const handleColorColumns = (): void => {
    setColorColumns(!colorColumns)
  }

  const handleSortBycountry = (): void => {
    setSortBycountry(!sortBycountry)
  }

  const handleDelete = (id: string): void => {
    setUsersResponse(usersResponse.filter(user => user.login.uuid !== id))
  }

  const handleReset = (): void => {
    setUsersResponse(originalUsers.current)
  }

  const sortedUsers = sortBycountry ? [...usersResponse].sort((a, b) => a.location.country.localeCompare(b.location.country)) : usersResponse

  return (
    <div className='bg-slate-700 text-white'>
      <div>
        <h1 className='text-6xl w-full text-center p-5 font-bold'>Prueba Tecnica</h1>
      </div>
      <div className='flex justify-center p-5 gap-3'>
        <button onClick={handleColorColumns} className='bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded'>Colorear columnas</button>
        <button onClick={handleSortBycountry} className='bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded'>{sortBycountry ? 'No ordenar por pais' : 'Ordenar por pais'}</button>
        <button onClick={handleReset} className='bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded'>Resetear estado</button>
        <input className='text-black' type="text" name="pais" placeholder='Filtrar por pais' />
      </div>
      <div className="w-4/5 mx-auto overflow-hidden rounded-lg shadow-xs">
        <div className="w-full overflow-x-auto">
          <table className="w-full whitespace-no-wrap">
            <thead>
              <tr className="text-xs font-semibold tracking-wide text-left uppercase">
                <th className="px-4 py-3">Foto</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Apellido</th>
                <th className="px-4 py-3">Pais</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((user, index) => (
                <tr className={colorColumns && index % 2 === 0 ? 'bg-slate-800' : ''} key={user.login.uuid}>
                  <td className="px-4 py-3">
                    <img src={user.picture.large} alt="" className="w-10 h-10 rounded-full" />
                  </td>
                  <td className="px-4 py-3">{user.name.first}</td>
                  <td className="px-4 py-3">{user.name.last}</td>
                  <td className="px-4 py-3">{user.location.country}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => { handleDelete(user.login.uuid) }} className='bg-slate-500 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded'>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default App