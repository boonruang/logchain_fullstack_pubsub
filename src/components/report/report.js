import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as systemActions from '../../actions/system.action'
import axios from 'axios'
import { round } from 'lodash'

const Report = () => {
  useEffect(() => {
    getSystemOS()
    callActions()
    setTimeout(() => {
      callJQuery()
    }, 1000)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const callActions = () => {
    dispatch(systemActions.getSystems())
  }

  const systemReducer = useSelector(({ systemReducer }) => systemReducer)
  const dispatch = useDispatch()
  const { sysResult } = systemReducer

  const callJQuery = () => {
    const script = document.createElement('script')
    script.src = `/js/report2_page.js`
    script.async = true
    document.body.appendChild(script)
  }

  const [cpuShow, setcpuShow] = useState()
  const [memShow, setmemShow] = useState()
  const [diskShow, setDiskShow] = useState()

  const getSystemOS = () => {
    axios.get(`http://61.19.101.249:3001/api/v2/system/os`).then((res) => {
    // axios.get(`http://192.168.0.150:3000/api/v2/system/os`).then((res) => {
      let cpuData = res.data.cpuInfo
      let memData = res.data.memInfo
      let diskData = res.data.diskInfo

      setcpuShow(cpuData)
      setmemShow(memData)
      setDiskShow(diskData)
    })
  }

  return (
    <div className="content-wrapper">
      {/* Content Header (Page header) */}
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>ทรัพยากรระบบ</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <div>System</div>
                </li>

                <li className="breadcrumb-item active">ทรัพยากรระบบ</li>
              </ol>
            </div>
          </div>
        </div>
        {/* /.container-fluid */}
      </section>
      {/* Main content */}
      <section className="content">
        <div className="container-fluid">
              {/* NODE */}
              <div className="card card-success">
                <div className="card-header">
                  <h3 className="card-title">โครงข่าย (Node)</h3>
                  <div className="card-tools">
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="collapse"
                    >
                      <i className="fas fa-minus" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-tool"
                      data-card-widget="remove"
                    >
                      <i className="fas fa-times" />
                    </button>
                  </div>
                </div>
                {/* /.card-header */}
                <div className="card-body">
                  <div className="row">
                    <div className="col-6 col-md-3 text-center">
                      <input
                        type="text"
                        className="knob"
                        defaultValue={sysResult ? sysResult.blockCount : null}
                        data-min={0}
                        data-max={1000}
                        data-width={120}
                        data-height={120}
                        data-fgcolor="#f56954"
                        data-readonly="true"
                      />
                      <div className="knob-label">จำนวนห่วงโซ่บล็อก</div>
                    </div>
                    {/* ./col */}
                    <div className="col-6 col-md-3 text-center">
                      <input
                        type="text"
                        className="knob"
                        defaultValue={sysResult ? sysResult.nodes : null}
                        data-min={0}
                        data-max={3}
                        data-width={120}
                        data-height={120}
                        data-fgcolor="#00c0ef"
                        data-readonly="true"
                      />
                      <div className="knob-label">จำนวนโครงข่ายโหนด</div>
                    </div>
                    {/* ./col */}
                    <div className="col-6 col-md-3 text-center">
                      <input
                        type="text"
                        className="knob"
                        defaultValue={sysResult ? sysResult.active : null}
                        data-min={0}
                        data-max={3}
                        data-width={120}
                        data-height={120}
                        data-fgcolor="#00a65a"
                        data-readonly="true"
                      />
                      <div className="knob-label">โหนดที่ทำงานอยู่</div>
                    </div>
                    {/* ./col */}
                    {/* ./col */}
                    <div className="col-6 col-md-3 text-center">
                      <input
                        type="text"
                        className="knob"
                        defaultValue={sysResult ? sysResult.users : null}
                        data-min={0}
                        data-max={1000}
                        data-width={120}
                        data-height={120}
                        data-fgcolor="#932ab6"
                        data-readonly="true"
                      />
                      <div className="knob-label">จำนวนผู้ใช้ API</div>
                    </div>
                    {/* ./col */}
                  </div>
                  {/* /.row */}

                  {/* /.row */}
                </div>
                {/* /.card-body */}
              </div>

        </div>
        {/* /.container-fluid */}
      </section>

      {/* /.content */}
    </div>
  )
}

export default Report
