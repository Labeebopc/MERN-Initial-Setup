import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

const Dashboard = () => {
    const [count, setCount] = useState(0)
    return (
        <>
            <section>
                <h1>MERN Initial Setup</h1>
            </section>

            <section className="card">
                <Button variant="outline" onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </Button>
            </section>
        </>
    )
}

export default Dashboard