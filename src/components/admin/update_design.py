import re

def update_newsroom():
    with open('d:\\Unitytvsite\\src\\components\\admin\\NewsroomDesk.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    # Replacements for NewsroomDesk
    content = content.replace('bg-white border-none rounded-2xl p-4 sm:p-5 shadow-sm border border-gray-100', 'bg-white rounded-xl p-6 shadow-sm border border-gray-200')
    content = content.replace('px-3 py-1.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all', 'px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all')
    content = content.replace('bg-brand-gold text-brand-dark shadow', 'bg-gray-900 text-white')
    content = content.replace('bg-gray-100 text-gray-900 border border-gray-300 shadow', 'bg-gray-900 text-white')
    content = content.replace('bg-gray-50 text-gray-600 hover:text-gray-900', 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700')
    
    content = content.replace('bg-gray-50 rounded-2xl p-1 border-none text-xs', 'bg-white rounded-lg p-1 border border-gray-200 text-sm shadow-sm')
    content = content.replace('px-2.5 py-1 rounded-lg font-bold', 'px-3 py-1.5 rounded-md font-medium')
    content = content.replace("filterType === 'all' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:text-gray-900'", "filterType === 'all' ? 'bg-gray-100 text-gray-900' : 'bg-transparent text-gray-600 hover:text-gray-900'")
    content = content.replace("filterType === 'breaking' ? 'bg-red-100 text-brand-crimson' : 'text-gray-600 hover:text-gray-900'", "filterType === 'breaking' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-transparent text-gray-600 hover:text-gray-900'")
    content = content.replace("filterType === 'hero' ? 'bg-amber-100 text-amber-700' : 'text-gray-600 hover:text-gray-900'", "filterType === 'hero' ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-transparent text-gray-600 hover:text-gray-900'")
    
    content = content.replace('px-3.5 py-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold tracking-tight text-xs rounded-2xl shadow-sm border border-gray-100', 'bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all border-none')
    
    content = content.replace('bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm', 'bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm')
    content = content.replace('bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase tracking-wider', 'border-t border-gray-200 border-b bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider')
    content = content.replace('divide-y divide-gray-100/60', 'divide-y divide-gray-200')
    content = content.replace('text-[10px] px-2 py-0.5 rounded-full font-bold uppercase', 'px-2.5 py-0.5 rounded-full text-xs font-medium border bg-gray-50 text-gray-700 border-gray-200')
    
    content = content.replace("style={{ backgroundColor: `${art.category.color}20`, color: art.category.color }}", "")
    
    content = content.replace('text-[11px]', 'text-xs')
    content = content.replace('text-[10px]', 'text-xs')
    content = content.replace('text-[9px]', 'text-xs')
    
    content = content.replace('bg-red-50 text-brand-crimson border border-red-100 font-semibold tracking-tight uppercase', 'bg-red-50 text-red-700 border-red-100 font-medium')
    content = content.replace('bg-amber-50 text-amber-700 border border-amber-200 font-semibold tracking-tight uppercase', 'bg-amber-50 text-amber-700 border-amber-100 font-medium')
    content = content.replace('bg-gray-50 text-gray-500 border border-gray-200 font-bold uppercase', 'bg-gray-50 text-gray-600 border-gray-200 font-medium')
    
    content = content.replace('font-bold', 'font-medium')
    
    content = content.replace('p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors', 'p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors')
    content = content.replace('p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-brand-gold hover:text-amber-300 transition-colors', 'p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors')
    content = content.replace('p-1.5 rounded-lg bg-gray-50 hover:bg-red-950 text-gray-600 hover:text-red-400 transition-colors', 'p-2 rounded-lg bg-white border border-gray-200 hover:bg-red-50 text-red-600 transition-colors')
    
    content = content.replace('bg-white border border-gray-300 rounded-2xl max-w-2xl w-full p-4 sm:p-6 max-h-[92vh] overflow-y-auto shadow-2xl space-y-4', 'bg-white border border-gray-200 rounded-xl max-w-2xl w-full p-6 max-h-[92vh] overflow-y-auto shadow-xl space-y-6')
    content = content.replace('bg-gray-50 border border-gray-300 rounded-2xl px-3.5 py-2.5 text-gray-900 focus:outline-none focus:border-brand-crimson text-sm', 'bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm')
    content = content.replace('bg-gray-50 border border-gray-300 rounded-2xl px-3 py-2', 'bg-white border border-gray-200 rounded-lg px-4 py-2')
    content = content.replace('bg-gray-50 border border-gray-300 rounded-2xl px-3.5 py-2', 'bg-white border border-gray-200 rounded-lg px-4 py-2')
    
    content = content.replace('px-4 py-2 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium', 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium')
    content = content.replace('px-5 py-2 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white font-semibold tracking-tight shadow-sm border border-gray-100 transition-all', 'bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all')

    with open('d:\\Unitytvsite\\src\\components\\admin\\NewsroomDesk.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

def update_liveblog():
    with open('d:\\Unitytvsite\\src\\components\\admin\\LiveBlogDesk.tsx', 'r', encoding='utf-8') as f:
        content = f.read()

    content = content.replace('bg-white border-none rounded-2xl p-5 shadow-sm border border-gray-100', 'bg-white rounded-xl p-6 shadow-sm border border-gray-200')
    content = content.replace("px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${blogData.is_active ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' : 'bg-gray-100 text-gray-500 border-none'}", "px-2.5 py-0.5 text-xs font-medium border rounded-full ${blogData.is_active ? 'bg-red-50 text-red-700 border-red-100 animate-pulse' : 'bg-gray-50 text-gray-600 border-gray-200'}")
    
    content = content.replace("px-4 py-2 rounded-2xl text-xs font-bold transition-colors ${blogData.is_active ? 'bg-gray-100 hover:bg-gray-200 text-gray-700' : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'}", "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium transition-all")
    content = content.replace('px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold rounded-2xl shadow-sm border border-gray-100', 'bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all border-none')
    
    content = content.replace('bg-white border-none rounded-2xl shadow-sm border border-gray-100 overflow-hidden', 'bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm')
    content = content.replace('p-4 bg-gray-50 border-b border-gray-200', 'p-4 border-b border-gray-200 bg-white')
    content = content.replace('text-[11px] font-bold text-gray-400 uppercase tracking-widest uppercase tracking-wider', 'text-xs font-medium text-gray-500 uppercase tracking-wider')
    content = content.replace('divide-y divide-gray-100', 'divide-y divide-gray-200')
    
    content = content.replace('px-2 py-0.5 bg-brand-gold/20 text-amber-800 text-[10px] font-bold rounded', 'px-2.5 py-0.5 rounded-full text-xs font-medium border bg-amber-50 text-amber-700 border-amber-100')
    content = content.replace('p-1.5 text-gray-500 hover:text-brand-crimson bg-white border-none rounded-lg shadow-sm border border-gray-100', 'p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700')
    content = content.replace('p-1.5 text-gray-500 hover:text-red-600 bg-white border-none rounded-lg shadow-sm border border-gray-100', 'p-2 rounded-lg bg-white border border-gray-200 hover:bg-red-50 text-red-600')
    
    content = content.replace('bg-white border-none rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl', 'bg-white border border-gray-200 rounded-xl w-full max-w-2xl overflow-hidden shadow-xl')
    content = content.replace('bg-gray-50 border border-gray-300 rounded-2xl px-3 py-2 text-gray-900 text-sm focus:border-brand-crimson focus:outline-none', 'bg-white border border-gray-200 rounded-lg px-4 py-2 text-gray-900 text-sm focus:ring-1 focus:ring-gray-900 focus:border-gray-900 focus:outline-none')
    
    content = content.replace('px-4 py-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm font-bold rounded-2xl transition-colors', 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg px-4 py-2 text-sm font-medium')
    content = content.replace('px-4 py-2 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white text-sm font-bold rounded-2xl', 'bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white rounded-lg px-4 py-2 text-sm font-medium transition-all')

    content = content.replace('font-bold', 'font-medium')
    
    with open('d:\\Unitytvsite\\src\\components\\admin\\LiveBlogDesk.tsx', 'w', encoding='utf-8') as f:
        f.write(content)

update_newsroom()
update_liveblog()
