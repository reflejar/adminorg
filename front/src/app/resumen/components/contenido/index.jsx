import React, { useEffect, useState, useRef } from 'react';
import Listado from "@/components/listados";
import Spinner from "@/components/spinner";
import { analisisActions } from "@/redux/actions/analisis";
import { connect, useDispatch } from 'react-redux';
import * as echarts from 'echarts/core';
import { PieChart, BarChart, LineChart } from 'echarts/charts';
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    GridComponent
} from 'echarts/components';
import {
    CanvasRenderer
} from 'echarts/renderers';
import { colors } from '@/utility/colors';

// Register necessary components
echarts.use(
    [TitleComponent, TooltipComponent, LegendComponent, PieChart, BarChart, LineChart, CanvasRenderer, GridComponent]
);

function Contenido({ analizar, agrupar_por, periodo, totalizar }) {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [data, setData] = useState([]);
    const chartRef = useRef(null);

    useEffect(() => {
        if (analizar.length > 0 && totalizar !== '') {
            setLoading(true);
            dispatch(analisisActions.fetchData({ analizar, agrupar_por, periodo, totalizar }))
                .then((response) => {
                    setData(response.data);
                })
                .finally(() => setLoading(false));
        }
    }, [analizar, agrupar_por, periodo, totalizar]);

    useEffect(() => {
        if (data.length > 0) {
            if (analizar.length > 1) {
                renderBarChart();
            }
            else if (periodo === 'mensual') {
                renderStackedLineChart();
            } else {
                renderPieChart();
            }
        }
    }, [data, periodo]);

    const renderStackedLineChart = () => {
        chartRef.current.innerHTML = '';
        const chartDom = chartRef.current;
        const myChart = echarts.init(chartDom);
        const nuevasColumnas = data.length > 0 ? Object.keys(data[0]).filter((o) => o !== "cuenta" && o !== "proyecto" && o !== "concepto") : [];
    
        const groupByColumn = agrupar_por || analizar[0] === "proyecto" ? "proyecto" : "cuenta";
    
        // Crear mapa para agrupar datos
        const aggregatedData = data.reduce((acc, item) => {
            const group = item[groupByColumn];
            if (!acc[group]) {
                acc[group] = nuevasColumnas.map(() => 0);
            }
            nuevasColumnas.forEach((col, index) => {
                acc[group][index] += parseFloat(item[col]) || 0;
            });
            return acc;
        }, {});
    
        // // Aplicar suma acumulativa por grupo
        // Object.keys(aggregatedData).forEach(group => {
        //     for (let i = 1; i < nuevasColumnas.length; i++) {
        //         aggregatedData[group][i] += aggregatedData[group][i - 1]; // Acumulación
        //     }
        // });
    
        const seriesData = Object.keys(aggregatedData).map(group => ({
            name: group,
            type: 'line',
            data: aggregatedData[group]
        }));
    
        const option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                formatter: function (params) {
                    return `<b>${params[0].name}</b><br />${params.map(p => `${p.marker}${p.seriesName}: $${p.value.toLocaleString('de-DE', { minimumFractionDigits: 0 })}`).join('<br />')}`;
                }
            },
            color: colors,
            legend: {
                data: Object.keys(aggregatedData)
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
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
    
    const renderBarChart = () => {
        const chartDom = chartRef.current;
        const myChart = echarts.init(chartDom);

        // Determine which column to use based on agrupar_por
        const groupByColumn = agrupar_por || analizar[0] === "proyecto" ? "proyecto" : "cuenta";

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
        const barChartData = Object.keys(totalsByGroup).map(groupKey => ({
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
            color: colors,
            xAxis: [
                {
                  type: 'category',
                  data: barChartData.map(item => item.name),
                //   axisTick: {
                //     alignWithLabel: true
                //   }
                }
              ],     
              yAxis: [
                {
                  type: 'value'
                }
              ],                                 
            series: [
                {
                    name: '', // Remove the 'Bar Chart' name
                    type: 'bar',
                    data: barChartData,
                    barWidth: '25%',

                }
            ]
        };

        myChart.setOption(option);
    };


    const renderPieChart = () => {
        const chartDom = chartRef.current;
        const myChart = echarts.init(chartDom);

        // Determine which column to use based on agrupar_por
        const groupByColumn = agrupar_por || analizar[0] === "proyecto" ? "proyecto" : "cuenta";

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
            color: colors,
            series: [
                {
                    name: '', // Remove the 'Pie Chart' name
                    type: 'pie',
                    radius: ['40%', '70%'],
                    data: pieChartData,
                    avoidLabelOverlap: false,
                    padAngle: 5,                    
                    label: {
                        show: true, // Show labels on the pie chart
                        formatter: function (params) {
                            return `${params.name}: $${params.value.toLocaleString()} (${params.percent}%)`;
                        }
                    },
                    itemStyle: {
                        borderRadius: 10
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


            <section className="monitor-body-without-footer bg-white p-3">
                {loading ? <Spinner /> : data.length > 0 ? 
                        <div>
                            <div ref={chartRef} style={{ height: '30vh' }} />
                            <Listado items={data} columns={Object.keys(data[0]).map(k => ({ key: k, label: k }))} />
                        </div> 
                        : 
                        <p>No hay datos para mostrar</p>
                }
            </section>
        </div>
    );
}

const mapStateToProps = state => ({
    analizar: state.analisis.analizar,
    agrupar_por: state.analisis.agrupar_por,
    periodo: state.analisis.periodo,
    totalizar: state.analisis.totalizar,
});

export default connect(mapStateToProps, null)(Contenido);
