import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Lead } from '../types';
import { MessageCircle, Trash2, Calendar, Mail, User, Phone, Search, Grid3x3, List, ChevronDown, ChevronUp, Filter, FileText, Edit2, Save, X as CloseIcon } from 'lucide-react';
import { QuoteModal } from './QuoteModal';

export const CRM: React.FC = () => {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [sortField, setSortField] = useState<'name' | 'created_at' | 'status'>('created_at');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');
    const [selectedQuoteLead, setSelectedQuoteLead] = useState<Lead | null>(null);
    const [editingLead, setEditingLead] = useState<Lead | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<Lead>>({});

    useEffect(() => {
        fetchLeads();

        // Subscribe to real-time changes
        const subscription = supabase
            .channel('leads_channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, (payload) => {
                fetchLeads();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchLeads = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) {
            setLeads(data as Lead[]);
        }
        setLoading(false);
    };

    const updateStatus = async (id: string, newStatus: string) => {
        const { error } = await supabase
            .from('leads')
            .update({ status: newStatus })
            .eq('id', id);

        if (!error) {
            setLeads(prev => prev.map(lead => lead.id === id ? { ...lead, status: newStatus as any } : lead));
        }
    };

    const deleteLead = async (id: string) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar este cliente potencial?')) return;

        const { error } = await supabase
            .from('leads')
            .delete()
            .eq('id', id);

        if (!error) {
            setLeads(prev => prev.filter(lead => lead.id !== id));
        }
    };

    const startEditing = (lead: Lead) => {
        setEditingLead(lead);
        setEditFormData({
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            service: lead.service,
            event_date: lead.event_date,
            message: lead.message
        });
    };

    const handleUpdateLead = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingLead) return;

        const { error } = await supabase
            .from('leads')
            .update(editFormData)
            .eq('id', editingLead.id);

        if (!error) {
            setLeads(prev => prev.map(l => l.id === editingLead.id ? { ...l, ...editFormData } : l));
            setEditingLead(null);
        } else {
            alert('Error al actualizar el cliente: ' + error.message);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'New': return 'bg-blue-500/20 text-blue-300 border-blue-500/50';
            case 'Contacted': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50';
            case 'Booked': return 'bg-green-500/20 text-green-300 border-green-500/50';
            case 'Lost': return 'bg-red-500/20 text-red-300 border-red-500/50';
            default: return 'bg-gray-500/20 text-gray-300';
        }
    };

    const handleSort = (field: 'name' | 'created_at' | 'status') => {
        if (sortField === field) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const filteredLeads = leads
        .filter(lead => {
            const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.phone?.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            let aValue: any, bValue: any;

            if (sortField === 'name') {
                aValue = a.name.toLowerCase();
                bValue = b.name.toLowerCase();
            } else if (sortField === 'created_at') {
                aValue = new Date(a.created_at).getTime();
                bValue = new Date(b.created_at).getTime();
            } else if (sortField === 'status') {
                aValue = a.status;
                bValue = b.status;
            }

            if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

    const SortIcon = ({ field }: { field: 'name' | 'created_at' | 'status' }) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
    };

    return (
        <div className="min-h-screen bg-background-dark pt-[150px] pb-24 px-6 md:px-12 text-ivory">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
                    <div>
                        <span className="text-gold uppercase tracking-[0.2em] text-xs font-bold bg-gold/10 px-4 py-1 rounded-full border border-gold/20 mb-4 block w-fit">
                            Panel de Administración
                        </span>
                        <h1 className="text-4xl font-serif font-bold">Gestión de Clientes (CRM)</h1>
                        <p className="text-ivory/50 mt-2">{filteredLeads.length} {filteredLeads.length === 1 ? 'cliente' : 'clientes'} encontrados</p>
                    </div>

                    <div className="flex gap-3 w-full md:w-auto">
                        {/* Search */}
                        <div className="relative flex-1 md:flex-initial">
                            <input
                                type="text"
                                placeholder="Buscar cliente..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="bg-card-dark border border-white/10 rounded-full py-3 pl-12 pr-6 w-full md:w-80 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all cursor-text"
                            />
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ivory/30 pointer-events-none" size={18} />
                        </div>

                        {/* View Toggle */}
                        <div className="flex bg-card-dark border border-white/10 rounded-full p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-full transition-all cursor-pointer ${viewMode === 'grid'
                                    ? 'bg-gold text-background-dark'
                                    : 'text-ivory/50 hover:text-ivory'
                                    }`}
                                title="Vista de Tarjetas"
                            >
                                <Grid3x3 size={20} className="pointer-events-none" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-full transition-all cursor-pointer ${viewMode === 'list'
                                    ? 'bg-gold text-background-dark'
                                    : 'text-ivory/50 hover:text-ivory'
                                    }`}
                                title="Vista de Lista"
                            >
                                <List size={20} className="pointer-events-none" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Status Filter */}
                <div className="mb-8 flex items-center gap-4">
                    <div className="flex items-center gap-2 text-ivory/70">
                        <Filter size={18} />
                        <span className="text-sm font-bold uppercase tracking-wider">Filtrar por estado:</span>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {['ALL', 'New', 'Contacted', 'Booked', 'Lost'].map((status) => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${statusFilter === status
                                    ? 'bg-gold text-background-dark shadow-lg'
                                    : 'bg-card-dark text-ivory/60 hover:bg-white/10 border border-white/10'
                                    }`}
                            >
                                {status === 'ALL' ? 'Todos' : status === 'New' ? 'Nuevo' : status === 'Contacted' ? 'Contactado' : status === 'Booked' ? 'Reservado' : 'Perdido'}
                            </button>
                        ))}
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
                    </div>
                ) : filteredLeads.length === 0 ? (
                    <div className="text-center py-20 text-ivory/30">
                        <User size={48} className="mx-auto mb-4 opacity-50" />
                        <p>No se encontraron clientes.</p>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredLeads.map((lead) => (
                            <div key={lead.id} className="bg-card-dark border border-white/5 rounded-2xl p-6 hover:border-gold/30 transition-all shadow-lg group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-xl text-gold">{lead.name}</h3>
                                        <div className="flex items-center gap-2 text-ivory/50 text-xs mt-1">
                                            <Calendar size={12} />
                                            {new Date(lead.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <select
                                        value={lead.status}
                                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                                        className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-3 py-1 border outline-none cursor-pointer ${getStatusColor(lead.status)}`}
                                    >
                                        <option className="bg-card-dark text-ivory" value="New">Nuevo</option>
                                        <option className="bg-card-dark text-ivory" value="Contacted">Contactado</option>
                                        <option className="bg-card-dark text-ivory" value="Booked">Reservado</option>
                                        <option className="bg-card-dark text-ivory" value="Lost">Perdido</option>
                                    </select>
                                </div>

                                <div className="space-y-3 mb-6">
                                    {lead.email && (
                                        <div className="flex items-center gap-3 text-ivory/70 text-sm">
                                            <Mail size={16} className="text-gold/50" />
                                            <span className="truncate">{lead.email}</span>
                                        </div>
                                    )}
                                    {lead.phone && (
                                        <div className="flex items-center gap-3 text-ivory/70 text-sm">
                                            <Phone size={16} className="text-gold/50" />
                                            {lead.phone}
                                        </div>
                                    )}
                                    <div className="bg-black/20 p-3 rounded-lg text-sm text-ivory/80 italic border border-white/5 mt-4 min-h-[80px]">
                                        "{lead.message || 'Sin descripción detallada'}"
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <span className="text-xs bg-white/5 px-2 py-1 rounded text-ivory/50">
                                            {lead.service}
                                        </span>
                                        {lead.event_date && (
                                            <span className="text-xs bg-white/5 px-2 py-1 rounded text-ivory/50">
                                                📅 {new Date(lead.event_date).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-white/5">
                                    <button
                                        onClick={() => setSelectedQuoteLead(lead)}
                                        className="flex-1 bg-gold/20 hover:bg-gold hover:text-background-dark text-gold border border-gold/30 rounded-lg py-2 flex items-center justify-center gap-2 font-bold text-sm transition-all"
                                    >
                                        <FileText size={16} /> Cotizar
                                    </button>
                                    <button
                                        onClick={() => startEditing(lead)}
                                        className="p-2 text-ivory/50 hover:bg-white/10 hover:text-ivory rounded-lg transition-colors"
                                        title="Editar"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    {lead.phone && (
                                        <a
                                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hola ${lead.name}, recibimos tu solicitud sobre ${lead.service}.`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-green-600/20 hover:bg-green-600 hover:text-white text-green-400 border border-green-600/30 rounded-lg transition-all"
                                            title="WhatsApp"
                                        >
                                            <MessageCircle size={16} />
                                        </a>
                                    )}
                                    <button
                                        onClick={() => deleteLead(lead.id)}
                                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-card-dark rounded-2xl border border-white/5 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-black/30 border-b border-white/5">
                                    <tr>
                                        <th
                                            onClick={() => handleSort('name')}
                                            className="text-left py-4 px-6 text-xs font-bold text-gold uppercase tracking-wider cursor-pointer hover:bg-white/5 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                Cliente
                                                <SortIcon field="name" />
                                            </div>
                                        </th>
                                        <th className="text-left py-4 px-6 text-xs font-bold text-gold uppercase tracking-wider">Contacto</th>
                                        <th className="text-left py-4 px-6 text-xs font-bold text-gold uppercase tracking-wider">Servicios</th>
                                        <th
                                            onClick={() => handleSort('created_at')}
                                            className="text-left py-4 px-6 text-xs font-bold text-gold uppercase tracking-wider cursor-pointer hover:bg-white/5 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                Fecha Evento
                                                <SortIcon field="created_at" />
                                            </div>
                                        </th>
                                        <th
                                            onClick={() => handleSort('status')}
                                            className="text-left py-4 px-6 text-xs font-bold text-gold uppercase tracking-wider cursor-pointer hover:bg-white/5 transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                Estado
                                                <SortIcon field="status" />
                                            </div>
                                        </th>
                                        <th className="text-left py-4 px-6 text-xs font-bold text-gold uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredLeads.map((lead) => (
                                        <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="py-4 px-6">
                                                <div>
                                                    <div className="font-bold text-ivory">{lead.name}</div>
                                                    <div className="text-xs text-ivory/50 flex items-center gap-1 mt-1">
                                                        <Calendar size={10} />
                                                        {new Date(lead.created_at).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="space-y-1 text-sm">
                                                    {lead.email && (
                                                        <div className="flex items-center gap-2 text-ivory/70">
                                                            <Mail size={12} className="text-gold/50" />
                                                            <span className="truncate max-w-[200px]">{lead.email}</span>
                                                        </div>
                                                    )}
                                                    {lead.phone && (
                                                        <div className="flex items-center gap-2 text-ivory/70">
                                                            <Phone size={12} className="text-gold/50" />
                                                            {lead.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="max-w-[200px]">
                                                    <div className="text-sm text-ivory/80 line-clamp-2">{lead.service}</div>
                                                    {lead.message && (
                                                        <div className="text-xs text-ivory/50 italic mt-1 line-clamp-1">"{lead.message}"</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="text-sm text-ivory/70">
                                                    {lead.event_date ? new Date(lead.event_date).toLocaleDateString() : '—'}
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <select
                                                    value={lead.status}
                                                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                                                    className={`text-[10px] font-bold uppercase tracking-wider rounded-full px-3 py-1 border outline-none cursor-pointer ${getStatusColor(lead.status)}`}
                                                >
                                                    <option className="bg-card-dark text-ivory" value="New">Nuevo</option>
                                                    <option className="bg-card-dark text-ivory" value="Contacted">Contactado</option>
                                                    <option className="bg-card-dark text-ivory" value="Booked">Reservado</option>
                                                    <option className="bg-card-dark text-ivory" value="Lost">Perdido</option>
                                                </select>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => setSelectedQuoteLead(lead)}
                                                        className="p-2 bg-gold/20 hover:bg-gold hover:text-background-dark text-gold border border-gold/30 rounded-lg transition-all"
                                                        title="Cotizar"
                                                    >
                                                        <FileText size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => startEditing(lead)}
                                                        className="p-2 text-ivory/50 hover:bg-white/10 hover:text-white rounded-lg transition-all"
                                                        title="Editar"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    {lead.phone && (
                                                        <a
                                                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Hola ${lead.name}, recibimos tu solicitud sobre ${lead.service}.`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 bg-green-600/20 hover:bg-green-600 hover:text-white text-green-400 border border-green-600/30 rounded-lg transition-all"
                                                            title="WhatsApp"
                                                        >
                                                            <MessageCircle size={16} />
                                                        </a>
                                                    )}
                                                    <button
                                                        onClick={() => deleteLead(lead.id)}
                                                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Lead Modal */}
            {editingLead && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-background-dark border border-white/10 rounded-[2rem] shadow-2xl w-full max-w-xl overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-card-dark">
                            <h2 className="text-2xl font-serif font-bold text-gold">Editar Cliente</h2>
                            <button onClick={() => setEditingLead(null)} className="p-2 hover:bg-white/5 rounded-full">
                                <CloseIcon size={24} className="text-ivory/50" />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateLead} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-ivory/50 mb-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    value={editFormData.name || ''}
                                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-ivory focus:border-gold outline-none"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-ivory/50 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={editFormData.email || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-ivory focus:border-gold outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-ivory/50 mb-1">Teléfono</label>
                                    <input
                                        type="text"
                                        value={editFormData.phone || ''}
                                        onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-ivory focus:border-gold outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-ivory/50 mb-1">Servicio Interés</label>
                                <input
                                    type="text"
                                    value={editFormData.service || ''}
                                    onChange={(e) => setEditFormData({ ...editFormData, service: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-ivory focus:border-gold outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-ivory/50 mb-1">Fecha del Evento</label>
                                <input
                                    type="date"
                                    value={editFormData.event_date || ''}
                                    onChange={(e) => setEditFormData({ ...editFormData, event_date: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-ivory focus:border-gold outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-ivory/50 mb-1">Mensaje/Notas</label>
                                <textarea
                                    value={editFormData.message || ''}
                                    onChange={(e) => setEditFormData({ ...editFormData, message: e.target.value })}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-ivory focus:border-gold outline-none h-24 resize-none"
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingLead(null)}
                                    className="flex-1 px-6 py-3 border border-white/10 rounded-xl text-ivory hover:bg-white/5 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-gold text-background-dark px-6 py-3 rounded-xl font-bold hover:bg-gold-light transition-all flex items-center justify-center gap-2"
                                >
                                    <Save size={18} /> Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {selectedQuoteLead && (
                <QuoteModal
                    lead={selectedQuoteLead}
                    onClose={() => setSelectedQuoteLead(null)}
                />
            )}
        </div>
    );
};
