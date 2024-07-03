import React, { useEffect, useState, useRef } from 'react';
import Listado from "@/components/listados";
import Spinner from "@/components/spinner";
import { analisisActions } from "@/redux/actions/analisis";
import { connect, useDispatch } from 'react-redux';
import * as echarts from 'echarts/core';
import { PieChart, BarChart } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
} from 'echarts/components';
import {
    CanvasRenderer
} from 'echarts/renderers';

// Register necessary components
echarts.use(
    [TitleComponent, TooltipComponent, LegendComponent, PieChart, BarChart, CanvasRenderer, GridComponent]
);

function Contenido({ analizar, agrupar_por, encolumnar, totalizar }) {
    const [activeTab, setActiveTab] = useState("tabla");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const chartRef = useRef(null);

    useEffect(() => {
        if (analizar.length > 0 && totalizar !== '') {
            setLoading(true);
            dispatch(analisisActions.fetchData({ analizar, agrupar_por, encolumnar, totalizar }))
                .then((response) => {
                    setData(response.data);
                })
                .finally(() => setLoading(false));
        }
    }, [analizar, agrupar_por, encolumnar, totalizar]);

    useEffect(() => {
        if (activeTab === 'grafico' && data.length > 0) {
            if (encolumnar === 'periodo') {
                renderStackedBarChart();
            } else {
                renderPieChart();
            }
        }
    }, [activeTab, data, encolumnar]);

    const renderStackedBarChart = () => {
        const chartDom = chartRef.current;
        const myChart = echarts.init(chartDom);
        const nuevasColumnas = data.length > 0 ? Object.keys(data[0]).filter((o) => o !== "cuenta" && o !== "proyecto" && o !== "concepto") : [];
    
        // Determine the groupByColumn based on agrupar_por
        const groupByColumn = agrupar_por || 'cuenta';
    
        // Create a map to aggregate data
        const aggregatedData = data.reduce((acc, item) => {
            const group = item[groupByColumn];
            if (!acc[group]) {
                acc[group] = nuevasColumnas.map(col => 0);
            }
            nuevasColumnas.forEach((col, index) => {
                acc[group][index] += parseFloat(item[col]) || 0;
            });
            return acc;
        }, {});
    
        const seriesData = Object.keys(aggregatedData).map(group => ({
            name: group,
            type: 'bar',
            stack: 'total',
            data: aggregatedData[group]
        }));
    
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function (params) {
                    return `${params[0].name}<br />${params.map(p => `${p.marker}${p.seriesName}: $${p.value.toLocaleString('de-DE', { minimumFractionDigits: 0 })}`).join('<br />')}`;
                }
            },
            legend: {
                data: Object.keys(aggregatedData)
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                data: nuevasColumnas
            },
            yAxis: {
                type: 'value',
                allowDecimals: false,
                axisLabel: {
                    formatter: function (value) {
                        return `$${value.toLocaleString('de-DE', { minimumFractionDigits: 0 })}`;
                    }
                }
            },
            series: seriesData
        };
    
        myChart.setOption(option);
    };
    
    

    const renderPieChart = () => {
        const chartDom = chartRef.current;
        const myChart = echarts.init(chartDom);

        // Determine which column to use based on agrupar_por
        const groupByColumn = agrupar_por || 'cuenta';

        // Aggregate totals by the selected column
        const totalsByGroup = data.reduce((acc, item) => {
            const groupKey = item[groupByColumn];
            const total = parseFloat(item.total);
            if (!isNaN(total)) {
                if (acc[groupKey]) {
                    acc[groupKey] += total;
                } else {
                    acc[groupKey] = total;
                }
            }
            return acc;
        }, {});

        // Format data for pie chart
        const pieChartData = Object.keys(totalsByGroup).map(groupKey => ({
            name: groupKey,
            value: totalsByGroup[groupKey]
        }));

        const option = {
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return `${params.name}: $${params.value.toLocaleString()} (${params.percent}%)`;
                }
            },
            series: [
                {
                    name: '', // Remove the 'Pie Chart' name
                    type: 'pie',
                    radius: '70%', // Adjust radius as needed
                    data: pieChartData,
                    label: {
                        show: true, // Show labels on the pie chart
                        formatter: function (params) {
                            return `${params.name}: $${params.value.toLocaleString()} (${params.percent}%)`;
                        }
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        myChart.setOption(option);
    };

    return (
        <div className="col-lg-8 min-vh-100">
            <section className="monitor-head pt-3 px-4">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <a
                            className={`nav-link ${activeTab === "tabla" && "active"} pointer`}
                            onClick={() => setActiveTab("tabla")}
                        >
                            <i className="bi-list-check me-2" /> Tablas
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            className={`nav-link ${activeTab === "grafico" && "active"} pointer`}
                            onClick={() => setActiveTab("grafico")}
                        >
                            <i className="bi-graph-up-arrow me-2" /> Gráficos
                        </a>
                    </li>
                </ul>
            </section>

            <section className="monitor-body-without-footer bg-white p-3">
                {loading ? <Spinner /> : (
                    activeTab === "tabla" ? (
                        data.length > 0 ? <Listado items={data} columns={Object.keys(data[0]).map(k => ({ key: k, label: k }))} /> : ""
                    ) : (
                        <div ref={chartRef} style={{ height: '400px' }} />
                    )
                )}
            </section>
        </div>
    );
}

const mapStateToProps = state => ({
    analizar: state.analisis.analizar,
    agrupar_por: state.analisis.agrupar_por,
    encolumnar: state.analisis.encolumnar,
    totalizar: state.analisis.totalizar,
});

export default connect(mapStateToProps, null)(Contenido);
