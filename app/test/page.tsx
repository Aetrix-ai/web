'use client'

import { Button } from "@/components/ui/button"
import { apiClientWithAuth } from "@/lib/utils"
import { useEffect, useState } from "react"

export default function Test() {
    const [done, setDone] = useState(false)
    const [enable, setEnable] = useState(true)
    return (
        <div>
            <Button disabled = {!enable} className={done? "bg-green-500":"bg-red-500"} onClick={async () => {
                setEnable(false)
                await apiClientWithAuth().get("/git")
                setDone(true)
                setEnable(true)
            }}>Start</Button>
        </div>
    )
}