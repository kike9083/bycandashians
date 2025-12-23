
import React, { useState, useEffect } from 'react';
import { Lead, Product, ServiceItem } from '../types';
import { X, Plus, Trash2, Download, MessageCircle, ShoppingBag, Shirt, Settings } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface QuoteModalProps {
    lead: Lead;
    onClose: () => void;
}

interface QuoteItem {
    id: string;
    description: string;
    quantity: number;
    price: number;
    type: 'product' | 'service' | 'custom';
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ lead, onClose }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [customDescription, setCustomDescription] = useState('');
    const [customPrice, setCustomPrice] = useState<number>(0);

    const [logoBase64, setLogoBase64] = useState<string | null>(null);

    const [quoteNum, setQuoteNum] = useState('0001');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const [productsRes, servicesRes, settingsRes] = await Promise.all([
                supabase.from('products').select('*'),
                supabase.from('services').select('*'),
                supabase.from('app_settings').select('value').eq('key', 'quote_counter').single()
            ]);

            if (productsRes.data) setProducts(productsRes.data as Product[]);
            if (servicesRes.data) setServices(servicesRes.data as ServiceItem[]);

            if (settingsRes.data && settingsRes.data.value) {
                const nextCount = (settingsRes.data.value as any).count + 1;
                setQuoteNum(nextCount.toString().padStart(4, '0'));
            }

            setLoading(false);
        };

        fetchData();

        // Convert logo to base64
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = '/logo.png';
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                setLogoBase64(canvas.toDataURL('image/png'));
            }
        };
    }, []);

    const addItem = (item: Product | ServiceItem | 'custom') => {
        if (item === 'custom') {
            if (!customDescription || customPrice <= 0) return;
            const newItem: QuoteItem = {
                id: `custom-${Date.now()}`,
                description: customDescription,
                quantity: 1,
                price: customPrice,
                type: 'custom'
            };
            setQuoteItems([...quoteItems, newItem]);
            setCustomDescription('');
            setCustomPrice(0);
        } else if ('name' in item) {
            // Product
            const newItem: QuoteItem = {
                id: item.id,
                description: item.name,
                quantity: 1,
                price: item.price,
                type: 'product'
            };
            setQuoteItems([...quoteItems, newItem]);
        } else {
            // Service
            const newItem: QuoteItem = {
                id: item.id,
                description: item.title,
                quantity: 1,
                price: 0, // Services might not have a fixed price in the DB
                type: 'service'
            };
            setQuoteItems([...quoteItems, newItem]);
        }
    };

    const removeItem = (id: string) => {
        setQuoteItems(quoteItems.filter(item => item.id !== id));
    };

    const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
        setQuoteItems(quoteItems.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const calculateTotal = () => {
        return quoteItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const generatePDF = () => {
        try {
            const doc = new jsPDF();
            const total = calculateTotal();
            const date = new Date().toLocaleDateString();

            // Header bg
            doc.setFillColor(26, 26, 26); // Background dark
            doc.rect(0, 0, 210, 40, 'F');

            // Logo
            if (logoBase64) {
                try {
                    doc.addImage(logoBase64, 'PNG', 15, 5, 30, 30);
                } catch (e) {
                    console.error('Error adding image to PDF:', e);
                }
            }

            doc.setFontSize(24);
            doc.setTextColor(184, 158, 80); // Gold color #B89E50
            doc.text('Más que Polleras', 55, 20);
            doc.setFontSize(12);
            doc.setTextColor(245, 245, 240); // Ivory
            doc.text('una tradición.', 55, 28);

            doc.setFontSize(18);
            doc.setTextColor(184, 158, 80);
            doc.text('COTIZACIÓN', 150, 20);
            doc.setFontSize(10);
            doc.setTextColor(245, 245, 240);
            doc.text(`N°- ${quoteNum}`, 150, 28);
            doc.text(`Fecha: ${date}`, 150, 34);

            // Body content positioning
            let currentY = 55;
            doc.setTextColor(0, 0, 0);
            doc.setFontSize(14);
            doc.text('Información del Cliente', 15, currentY);
            doc.setDrawColor(184, 158, 80);
            doc.line(15, currentY + 2, 100, currentY + 2);

            currentY += 10;
            doc.setFontSize(11);
            doc.text(`Nombre: ${lead.name}`, 15, currentY);

            // Wrapped Service Text
            const serviceLabel = `Servicio: `;
            const serviceContent = lead.service || 'Varios';
            doc.setFont('', 'bold');
            doc.text(serviceLabel, 110, currentY);
            doc.setFont('', 'normal');

            const wrappedService = doc.splitTextToSize(serviceContent, 80);
            doc.text(wrappedService, 128, currentY);

            const serviceHeight = wrappedService.length * 5;

            currentY += 7;
            doc.text(`Teléfono: ${lead.phone || 'N/A'}`, 15, currentY);

            // Event Date relative to service height
            const eventDateY = 65 + Math.max(7, serviceHeight);
            if (lead.event_date) {
                doc.text(`Fecha Evento: ${new Date(lead.event_date).toLocaleDateString()}`, 110, eventDateY);
            }

            currentY += 7;
            doc.text(`Email: ${lead.email || 'N/A'}`, 15, currentY);

            // Table starts after information block
            const tableStartY = Math.max(90, eventDateY + 10);

            // Table
            const tableData = quoteItems.map(item => [
                item.description,
                item.quantity.toString(),
                `$${item.price.toFixed(2)}`,
                `$${(item.price * item.quantity).toFixed(2)}`
            ]);

            autoTable(doc, {
                startY: tableStartY,
                head: [['Descripción', 'Cant.', 'Precio Unit.', 'Subtotal']],
                body: tableData,
                foot: [['', '', 'TOTAL ESTIMADO:', `$${total.toFixed(2)}`]],
                headStyles: { fillColor: [184, 158, 80], textColor: [255, 255, 255], fontStyle: 'bold' },
                footStyles: { fillColor: [26, 26, 26], textColor: [184, 158, 80], fontStyle: 'bold', fontSize: 12 },
                styles: { fontSize: 10, cellPadding: 5 },
                alternateRowStyles: { fillColor: [250, 250, 245] }
            });

            const finalY = (doc as any).lastAutoTable.finalY || 150;

            // Terms & Footer
            doc.setFontSize(12);
            doc.setTextColor(184, 158, 80);
            doc.text('Términos y Condiciones', 15, finalY + 20);
            doc.line(15, finalY + 22, 65, finalY + 22);

            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            const terms = [
                '1. Esta cotización tiene una validez de 15 días calendario.',
                '2. Para reservar la fecha se requiere un abono del 50%.',
                '3. Los precios de alquiler pueden variar según el estado de la pieza.',
                '4. El cliente es responsable del cuidado de la indumentaria durante el alquiler.'
            ];
            terms.forEach((line, i) => {
                doc.text(line, 15, finalY + 30 + (i * 7));
            });

            doc.setFontSize(12);
            doc.setTextColor(184, 158, 80);
            doc.text('Gracias por preferir nuestra tradición.', 105, finalY + 70, { align: 'center' });

            return doc;
        } catch (error) {
            console.error('Error in generatePDF:', error);
            alert('Hubo un error al generar el PDF. Por favor intenta de nuevo.');
            return null;
        }
    };

    const handleDownload = async () => {
        const doc = generatePDF();
        if (doc) {
            doc.save(`Cotizacion_${lead.name.replace(/\s+/g, '_')}.pdf`);

            // Sync with DB: Increment the counter
            const currentNum = parseInt(quoteNum);
            const { error } = await supabase
                .from('app_settings')
                .update({ value: { count: currentNum } })
                .eq('key', 'quote_counter');

            if (!error) {
                // Advance local state for immediate next quote if modal stays open
                const nextNum = (currentNum + 1).toString().padStart(4, '0');
                setQuoteNum(nextNum);
            }
        }
    };

    const handleWhatsApp = () => {
        const total = calculateTotal();
        let message = `Hola ${lead.name}, adjunto tu cotización de Más que Polleras.\n\n`;
        message += `*Resumen de tu cotización:*\n`;
        quoteItems.forEach(item => {
            message += `- ${item.description}: ${item.quantity} x $${item.price.toFixed(2)} = $${(item.price * item.quantity).toFixed(2)}\n`;
        });
        message += `\n*TOTAL: $${total.toFixed(2)}*\n\n`;
        message += `¿Te gustaría proceder con la reserva?`;

        // Since we can't literally "attach" a PDF via a simple URL link, 
        // we send the text summary and the user can download/send the PDF manually.
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`, '_blank');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-background-dark border border-white/10 rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-card-dark">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-gold">Generar Cotización</h2>
                        <p className="text-ivory/50 text-sm">Cliente: {lead.name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                        <X size={24} className="text-ivory/50" />
                    </button>
                </div>

                <div className="flex-grow overflow-y-auto p-6 space-y-8">
                    {/* Select Items */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Catalog Polleras */}
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-2 font-bold text-ivory/80 uppercase tracking-wider text-sm">
                                <Shirt size={18} className="text-gold" /> Catálogo de Polleras
                            </h3>
                            <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                {loading ? (
                                    <div className="animate-pulse flex space-y-2 flex-col">
                                        {[1, 2, 3].map(i => <div key={i} className="h-10 bg-white/5 rounded-lg w-full"></div>)}
                                    </div>
                                ) : products.map(product => (
                                    <button
                                        key={product.id}
                                        onClick={() => addItem(product)}
                                        className="flex justify-between items-center p-3 bg-card-dark border border-white/5 rounded-xl hover:border-gold/50 transition-all text-left group"
                                    >
                                        <span className="text-sm text-ivory/80 group-hover:text-gold transition-colors">{product.name}</span>
                                        <span className="text-xs font-bold text-gold">${product.price.toFixed(2)}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Services */}
                        <div className="space-y-4">
                            <h3 className="flex items-center gap-2 font-bold text-ivory/80 uppercase tracking-wider text-sm">
                                <Settings size={18} className="text-gold" /> Servicios
                            </h3>
                            <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                                {loading ? (
                                    <div className="animate-pulse flex space-y-2 flex-col">
                                        {[1, 2, 3].map(i => <div key={i} className="h-10 bg-white/5 rounded-lg w-full"></div>)}
                                    </div>
                                ) : services.map(service => (
                                    <button
                                        key={service.id}
                                        onClick={() => addItem(service)}
                                        className="flex justify-between items-center p-3 bg-card-dark border border-white/5 rounded-xl hover:border-gold/50 transition-all text-left group"
                                    >
                                        <span className="text-sm text-ivory/80 group-hover:text-gold transition-colors">{service.title}</span>
                                        <Plus size={14} className="text-gold/50" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Custom Item */}
                    <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                        <h3 className="font-bold text-ivory/80 uppercase tracking-wider text-sm mb-4">Agregar Servicio Manual</h3>
                        <div className="flex flex-col md:flex-row gap-4">
                            <input
                                type="text"
                                placeholder="Descripción del servicio..."
                                value={customDescription}
                                onChange={(e) => setCustomDescription(e.target.value)}
                                className="flex-grow bg-background-dark border border-white/10 rounded-xl px-4 py-2 text-ivory focus:border-gold outline-none"
                            />
                            <div className="flex gap-4">
                                <input
                                    type="number"
                                    placeholder="Precio"
                                    value={customPrice || ''}
                                    onChange={(e) => setCustomPrice(parseFloat(e.target.value) || 0)}
                                    className="w-24 bg-background-dark border border-white/10 rounded-xl px-4 py-2 text-ivory focus:border-gold outline-none"
                                />
                                <button
                                    onClick={() => addItem('custom')}
                                    className="bg-gold text-background-dark px-6 py-2 rounded-xl font-bold hover:bg-gold-light transition-colors"
                                >
                                    Agregar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quote Items List */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-ivory/80 uppercase tracking-wider text-sm">Detalle de la Cotización</h3>
                        <div className="bg-card-dark border border-white/5 rounded-2xl overflow-hidden">
                            {quoteItems.length === 0 ? (
                                <div className="p-12 text-center text-ivory/20">
                                    <ShoppingBag size={48} className="mx-auto mb-4 opacity-10" />
                                    <p>No has agregado ningún ítem a la cotización.</p>
                                </div>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-black/30 border-b border-white/5">
                                        <tr>
                                            <th className="text-left py-3 px-4 text-xs font-bold text-gold uppercase">Ítem</th>
                                            <th className="text-center py-3 px-4 text-xs font-bold text-gold uppercase w-24">Cant.</th>
                                            <th className="text-right py-3 px-4 text-xs font-bold text-gold uppercase w-32">Precio</th>
                                            <th className="text-right py-3 px-4 text-xs font-bold text-gold uppercase w-32">Subtotal</th>
                                            <th className="text-center py-3 px-4 text-xs font-bold text-gold uppercase w-16"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {quoteItems.map((item) => (
                                            <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                                <td className="py-3 px-4 text-sm text-ivory/80">{item.description}</td>
                                                <td className="py-3 px-4">
                                                    <input
                                                        type="number"
                                                        value={item.quantity}
                                                        onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                                                        className="w-16 bg-background-dark border border-white/10 rounded-lg px-2 py-1 text-center text-ivory text-sm"
                                                    />
                                                </td>
                                                <td className="py-3 px-4">
                                                    <input
                                                        type="number"
                                                        value={item.price}
                                                        onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                                                        className="w-24 bg-background-dark border border-white/10 rounded-lg px-2 py-1 text-right text-ivory text-sm"
                                                    />
                                                </td>
                                                <td className="py-3 px-4 text-right text-sm text-gold font-bold">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </td>
                                                <td className="py-3 px-4 text-center">
                                                    <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-300 transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-black/30">
                                        <tr>
                                            <td colSpan={3} className="py-4 px-4 text-right font-bold text-ivory/50 uppercase tracking-widest text-xs">Total Estimado:</td>
                                            <td className="py-4 px-4 text-right text-2xl font-bold text-gold">${calculateTotal().toFixed(2)}</td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-6 border-t border-white/5 bg-card-dark flex flex-col md:flex-row gap-4">
                    <button
                        onClick={handleDownload}
                        disabled={quoteItems.length === 0}
                        className="flex-1 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-ivory py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Download size={20} /> Descargar PDF
                    </button>
                    <button
                        onClick={handleWhatsApp}
                        disabled={quoteItems.length === 0}
                        className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-bold transition-all shadow-lg shadow-green-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <MessageCircle size={20} /> Enviar por WhatsApp
                    </button>
                </div>
            </div>
        </div>
    );
};
